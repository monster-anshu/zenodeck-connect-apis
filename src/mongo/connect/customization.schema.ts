import { Schema } from 'mongoose';

const CHAT_ICON_POSITION = ['LEFT', 'RIGHT'] as const;

const chatIconStateSchema = new Schema(
  {
    backgroundColor: String,
    icon: String,
    iconColor: String,
  },
  { _id: false }
);

const chatIconSchema = new Schema(
  {
    maximized: chatIconStateSchema,
    minimized: chatIconStateSchema,
    position: {
      type: String,
      enum: CHAT_ICON_POSITION,
    },
  },
  { _id: false }
);

const botChatboxSchema = new Schema(
  {
    backgroundColor: String,
    textColor: String,
  },
  { _id: false }
);

const userChatboxSchema = new Schema(
  {
    backgroundColor: String,
    textColor: String,
  },
  { _id: false }
);

const sendButtonSchema = new Schema(
  {
    backgroundColor: String,
    textColor: String,
  },
  { _id: false }
);

const inputFieldSchema = new Schema(
  {
    backgroundColor: String,
    placeholder: String,
    textColor: String,
  },
  { _id: false }
);

const emojiIconSchema = new Schema(
  {
    activeColor: String,
    color: String,
    enable: Boolean,
  },
  { _id: false }
);

const attachmentIconSchema = new Schema(
  {
    color: String,
    enable: Boolean,
  },
  { _id: false }
);

const chatWindowSchema = new Schema(
  {
    attachmentIcon: attachmentIconSchema,
    backgroundColor: String,
    botChatbox: botChatboxSchema,
    emojiIcon: emojiIconSchema,
    enterKeyToSendMessage: Boolean,
    hideBranding: Boolean,
    inputField: inputFieldSchema,
    sendButton: sendButtonSchema,
    userChatbox: userChatboxSchema,
  },
  { _id: false }
);

const headerSchema = new Schema(
  {
    backgroundColor: String,
    displayProfilePicture: Boolean,
    logo: String,
    showLogo: Boolean,
    textColor: String,
  },
  { _id: false }
);

const keyEnableSchema = new Schema(
  {
    enable: Boolean,
    key: String,
  },
  { _id: false }
);

const preChatSchema = new Schema(
  {
    enable: Boolean,
    submitButton: sendButtonSchema,
  },
  { _id: false }
);

const multiChatSchema = new Schema(
  {
    enable: Boolean,
    submitButton: sendButtonSchema,
  },
  { _id: false }
);

export const customizationSchema = new Schema(
  {
    backgroundColor: String,
    chatIcon: chatIconSchema,
    chatWindow: chatWindowSchema,
    header: headerSchema,
    homeContent: {
      required: false,
      default: undefined,
      type: [keyEnableSchema],
    },
    multiChat: multiChatSchema,
    navigation: {
      required: false,
      default: undefined,
      type: [keyEnableSchema],
    },
    preChat: preChatSchema,
    primaryColor: String,
    textColor: String,
  },
  {
    _id: false,
  }
);
