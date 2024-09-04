const { User, Investment } = require("./db");
const schedule = require("node-schedule");

// Function to update user balances based on investments
async function updateBalances() {
  try {
    // Get all investments
    const investments = await Investment.find();

    for (const investment of investments) {
      const user = await User.findOne({ userId: investment.userId });

      if (user) {
        // Calculate interest (20% of the amount)
        const interest = investment.amount * 0.2;

        // Update the user's balance
        user.balance += interest;
        await user.save();

        // Optionally, reset investment or adjust as needed
        // investment.amount -= interest;
        // await investment.save();
      }
    }

    console.log("Balances updated successfully");
  } catch (err) {
    console.error("Error updating balances:", err);
  }
}

// Schedule the update function to run every 24 hours
schedule.scheduleJob("0 0 * * *", updateBalances); // Runs at midnight every day

// Handle balance request
module.exports.handleBalance = async (ctx) => {
  try {
    const user = await User.findOne({ userId: ctx.from.id });

    if (user) {
      ctx.reply(`Your balance is ${user.balance.toFixed(2)} USDT`);
    } else {
      ctx.reply("User not found.");
    }
  } catch (err) {
    console.error("Error fetching balance:", err);
    ctx.reply("An error occurred while fetching your balance.");
  }
};
