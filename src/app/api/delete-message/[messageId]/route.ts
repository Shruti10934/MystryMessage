import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import { Message } from '@/model/User';

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  const messageId = params.messageId;
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {

    const messageUser = await UserModel.findById(user._id);

    if(!messageUser){
      return Response.json({success: false, message: "User not found"}, {status: 404});
    }
    

    const newMessages = messageUser?.messages.filter((message: Message) => message._id.toString() !== messageId);
    messageUser.messages = newMessages;
    await messageUser.save();

   


    return Response.json(
      { message: 'Message deleted', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { message: 'Error deleting message', success: false },
      { status: 500 }
    );
  }
}