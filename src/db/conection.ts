import mongoose from "mongoose";
 
export const dbConnect = async ():Promise<boolean> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await mongoose.connect(process.env.MONGO_URL!);
    return true;
  } catch (e) {return false;}
}
