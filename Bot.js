const { Telegraf } = require("telegraf");
const { connectToDatabase, User } = require("./db");
const fs = require("fs");

// Initialize and connect to the database
connectToDatabase();

const BOT_TOKEN = "7418377962:AAFtkwxfM241PKTHDk_rgZ7Ybbl2fTdC1S0";
const bot = new Telegraf(BOT_TOKEN);

// Handle /start command
bot.start(async (ctx) => {
  const { id, first_name, last_name, username } = ctx.from;

  // Save user data to MongoDB
  await User.findOneAndUpdate(
    { userId: id },
    { firstName: first_name, lastName: last_name, username: username },
    { upsert: true, new: true }
  );

  ctx.replyWithPhoto("https://rebrand.ly/51fedd", {
    caption:
      "Hello, Coder! This is InvestMate ✨ - your reliable app for keeping and using your cryptocurrencies, all at your fingertips to make extra income for yourself! 📱\n" +
      "\n" +
      "We're excited to introduce our new Telegram mini-app! Start earning now, and soon you'll find out all the great USDT you can earn from them. ⚡\n" +
      "\n" +
      "Have friends? Invite them! The more, the merrier! 👯\n" +
      "\n" +
      "Remember: InvestMate is a place where you can invest your cryptocurrency and earn 20% every day, offering boundless investment opportunities!.🚀",
    reply_markup: {
      keyboard: [
        [
          { text: "balance", callback_data: "balance" },
          { text: "invest", callback_data: "invest" },
          { text: "withdraw", callback_data: "withdraw" },
        ],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
});

let waitingForWalletAddress = {};

bot.on("text", (ctx) => {
  const text = ctx.message.text;

  if (text === "invest") {
    const keyboard = [
      [
        { text: "3 USDT", callback_data: "invest_" },
        { text: "5 USDT", callback_data: "invest_" },
      ],
      [
        { text: "8 USDT", callback_data: "invest_" },
        { text: "10 USDT", callback_data: "invest_" },
      ],
      [
        { text: "20 USDT", callback_data: "invest_" },
        { text: "back", callback_data: "back" },
      ],
    ];

    ctx.reply("Choose an investment amount:", {
      reply_markup: {
        keyboard: keyboard,
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    });
  } else if (text === "back") {
    const keyboard = [
      [
        { text: "balance", callback_data: "balance" },
        { text: "invest", callback_data: "invest" },
        { text: "withdraw", callback_data: "withdraw" },
      ],
    ];
    ctx.reply("Choose an investment amount:", {
      reply_markup: {
        keyboard: keyboard,
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    });
  } else if (text === "balance") {
    ctx.reply("your balance is 0.1 USDT");
  } else if (text === "withdraw") {
    waitingForWalletAddress[ctx.from.id] = true;
    ctx.replyWithPhoto(
      {
        source: fs.createReadStream("./card.PNG"),
      },
      {
        caption:
          "⬇️ Now Please Submit Your USDT(BNB) Wallet Address \n " +
          "\n" +
          "Search USDT(BNB) in wallet or Safepal , Copy receive address and paste it Here",
      }
    );
  } else if (waitingForWalletAddress[ctx.from.id]) {
    // Process the user's wallet address
    const walletAddress = text;
    // Add your logic here to process the withdrawal
    ctx.reply(`Withdrawal processed to wallet address: ${walletAddress}`);
    waitingForWalletAddress[ctx.from.id] = false;
  }
});

// Launch the bot
bot.launch();
