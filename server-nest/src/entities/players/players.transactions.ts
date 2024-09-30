import mongoose from 'mongoose';

export const usePlayerInfoTransaction = async () => {
  const session = await mongoose.startSession();

  try {
    // Start the transaction
    // await session.withTransaction(async () => {
    //   // Update document in Model1
    //   await Model1.updateOne(
    //     { _id: id1 },
    //     {
    //       $set: {
    //         /* update fields */
    //       },
    //     },
    //   ).session(session);

    //   // Update document in Model2
    //   await Model2.updateOne(
    //     { _id: id2 },
    //     {
    //       $set: {
    //         /* update fields */
    //       },
    //     },
    //   ).session(session);
    // });

    console.log('Transaction completed successfully');
  } catch (error) {
    console.error('Transaction aborted:', error);
  } finally {
    // End the session
    session.endSession();
  }
};
