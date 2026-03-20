import dbconnection from "@/lib/dbConnection";
import { getServerSession } from "next-auth/next";
import UserModel from "@/models/User";
import { authOption } from "../../auth/[...nextauth]/options";
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  
  await dbconnection();
  
  const resolvedParams = await params;
  const userId = resolvedParams.messageid;
  const session = await getServerSession(authOption);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userIdStr = (session?.user as any)?._id; // extend NextAuth later

  if (!session?.user || !userIdStr) {
    return Response.json(
      { success: false, message: "Not Authenticated!" },
      { status: 401 }
    );
  }

  try {
    const userUpdate = await UserModel.updateOne(
      {_id: userIdStr},
      {$pull:{message:{_id:userId}}}
    )

    if(userUpdate.modifiedCount === 0){
       return Response.json(
      { success: false, message: "Message Not Found!" },
      { status: 404 }
    );
    }

     return Response.json(
      { success: true, message: "Message Delete Successfully!" },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { success: false, message: "Delete Message Request Error" },
      { status: 500 }
    );
  }
}
