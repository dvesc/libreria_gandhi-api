import mongoose from "mongoose";
 
export const dbConnect = async ():Promise<boolean> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await mongoose.connect("mongodb+srv://dvesc:d1123581321d@librarygandhi.1fvqw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
    return true;
  } catch (e) {return false;}
}
