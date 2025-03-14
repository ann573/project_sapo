interface IMessage {
  receiverId: string;
  senderId: string;
  text: string;
  image: string | null;
  _id: string;
}
export default IMessage;
