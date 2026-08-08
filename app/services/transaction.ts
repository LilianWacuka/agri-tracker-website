import {PrismaClient} from "@/generated/prisma/client";

const prisma = new PrismaClient();

export const createTransaction = async (
  type: "income" | "expense",
  name: string,
  userId: string | null | undefined,
  category: string,
  price: number | string,
  quantity: number | string,
  paymentMethod: string,
  date?: string | Date
) => {
  try {
    if (!userId?.trim()) {
      throw new Error("User ID is required to create a transaction");
    }
    const parsedPrice = typeof price === "number" ? price : parseFloat(price as string);
    const parsedQuantity = typeof quantity === "number" ? quantity : parseFloat(quantity as string);

    if (Number.isNaN(parsedPrice) || Number.isNaN(parsedQuantity)) {
      throw new Error("Invalid price or quantity");
    }

    const normalizedType = type === "income" || type === "expense" ? type : "expense";

    console.log("Incoming values:", {
      type,
      name,
      userId,
      category,
      price,
      quantity,
      paymentMethod,
      date,
    });

    const calculatedTotal = parsedPrice * parsedQuantity;

    const parsedDate = date ? new Date(date) : undefined;
    console.log("Parsed values:", {
      parsedPrice,
      parsedQuantity,
    });

    const created = await prisma.transaction.create({
      data: {
        type: normalizedType,
        name,
        userId,
        category,
        price: parsedPrice,
        quantity: parsedQuantity,
        total: calculatedTotal,
        paymentMethod,
        date: parsedDate,
      }
    });

    return created;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};
//get all transactions
export const getTransactions = async(userId: string) =>{
  try{
    const transactions = await prisma.transaction.findMany({
      where: {userId}
    })
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}
//update transaction
export const updateTransaction = async(id: string, name: string, category: string, 
  price: number | string, quantity: number | string, date?: string | Date, paymentMethod?: string) => {
    try{
      const updateData =await prisma.transaction.update({
        where: {id},
        data: {
          name,
          category,
          date: date ? new Date(date) : new Date(),
          price: typeof price === "number" ? price : parseFloat(price as string),
          quantity: typeof quantity === "number" ? quantity : parseFloat(quantity as string),
          total: (typeof price === "number" ? price : parseFloat(price as string)) * (typeof quantity === "number" ? quantity : parseFloat(quantity as string)),
          paymentMethod,
        }
      })
      return { ...updateData, message: "Transaction updated successfully" };
    }catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }
  //delete transaction
export const deleteTransaction = async(id: string) => {
  try{
    await prisma.transaction.delete({
      where: {id}
    })
    return { message: "Transaction deleted successfully" };
  }catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
}
