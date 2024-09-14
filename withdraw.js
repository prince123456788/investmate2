const waitingForWalletAddress = {};
const waitingForAmount = {};
const fs = require("fs");
const { User, Withdrawal } = require("./db"); // Import Withdrawal model

module.exports.handleWithdraw = async (ctx) => {
  waitingForWalletAddress[ctx.from.id] = true;
  ctx.replyWithPhoto(
    {
      source: fs.createReadStream("./card.PNG"),
    },
    {
      caption:
        "⬇️ Now Please Submit Your USDT(BNB) Wallet Address \n " +
        "\n" +
        "Search USDT(BNB) in wallet or Safepal, Copy receive address and paste it Here",
    }
  );
};

module.exports.handleText = async (ctx, text) => {
  if (waitingForWalletAddress[ctx.from.id] === true) {
    // Save the wallet address and prompt for amount
    waitingForWalletAddress[ctx.from.id] = text; // Save the wallet address
    waitingForAmount[ctx.from.id] = true; // Set waitingForAmount to true
    ctx.reply("Please enter the amount (e.g., 2 USDT).");
  } else if (waitingForAmount[ctx.from.id] === true) {
    const amount = parseFloat(text);

    if (isNaN(amount) || amount < 2) {
      ctx.reply("The withdrawable amount should be more than 2 USDT.");
    } else {
      try {
        // Retrieve user information from the database
        const user = await User.findOne({ userId: ctx.from.id });

        if (!user) {
          ctx.reply("User not found.");
          return;
        }

        // Check if the user has enough balance
        if (user.balance < amount) {
          ctx.reply("Insufficient balance.");
          return;
        }

        // Deduct the amount from user's balance
        user.balance -= amount;
        await user.save();

        // Log the withdrawal
        const withdrawal = new Withdrawal({
          userId: user.userId,
          wallet: waitingForWalletAddress[ctx.from.id], // Store the wallet address
          withdrawnAmount: amount,
          updatedBalance: user.balance,
        });
        await withdrawal.save();

        // Reply with confirmation messages
        ctx.reply(
          `Withdrawal processed to wallet address: ${
            waitingForWalletAddress[ctx.from.id]
          }`
        );
        ctx.reply("Successfully withdrawn!");

        // Reset the waiting flags after the withdrawal is completed
        delete waitingForWalletAddress[ctx.from.id];
        delete waitingForAmount[ctx.from.id];
      } catch (error) {
        console.error("Error processing withdrawal:", error);
        ctx.reply("An error occurred while processing your withdrawal.");
      }
    }
  }
};
