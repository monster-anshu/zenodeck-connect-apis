import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const CHAT_ICON_POSITION = ['LEFT', 'RIGHT'] as const;
const CHANNEL_STATUS = ['ACTIVE', 'INACTIVE', 'DELETED'] as const;
const CHANNEL_TYPE = ['WEB'] as const;

const Customization = new Schema(
  {
    chatIcon: {
      maximized: {
        backgroundColor: String,
        icon: String,
        iconColor: String,
      },
      minimized: {
        backgroundColor: String,
        icon: String,
        iconColor: String,
      },
      position: {
        enum: CHAT_ICON_POSITION,
        required: true,
        type: String,
      },
    },
    chatWindow: {
      attachmentIcon: {
        color: String,
        enabled: Boolean,
      },
      backgroundColor: String,
      botChatbox: {
        backgroundColor: String,
        textColor: String,
      },
      emojiIcon: {
        activeColor: String,
        color: String,
        enabled: Boolean,
      },
      enterKeyToSendMessage: Boolean,
      hideBranding: Boolean,
      inputField: {
        backgroundColor: String,
        placeholder: String,
        textColor: String,
      },
      sendButton: {
        activeBackgroudColor: String,
        activeColor: String,
        color: String,
      },
      userChatbox: {
        backgroundColor: String,
        textColor: String,
      },
    },
    header: {
      backgroundColor: String,
      displayProfilePicture: Boolean,
      showFaqButton: Boolean,
      showFaqForBusiness: [String],
      textColor: String,
    },
    multiChat: {
      createChatButton: {
        backgroundColor: String,
        text: String,
        textColor: String,
      },
      enabled: Boolean,
      heading: String,
    },
    preChat: {
      enabled: Boolean,
      formSetting: {
        emailId: {
          enabled: Boolean,
        },
        formSubtitle: String,
        formTitle: String,
        message: {
          enabled: Boolean,
        },
        name: {
          enabled: Boolean,
        },
        submitButton: {
          backgroundColor: String,
          text: String,
          textColor: String,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

const ChannelSchema = new Schema(
  {
    allowedDomains: [String],
    appId: {
      required: true,
      type: Schema.Types.ObjectId,
    },
    clientId: {
      required: true,
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
    },
    customization: Customization,
    description: {
      type: String,
    },
    enableFeedback: {
      default: false,
      type: Boolean,
    },
    enablePreview: {
      default: false,
      type: Boolean,
    },
    isConnected: {
      default: false,
      type: Boolean,
    },
    isDefault: {
      default: false,
      type: Boolean,
    },
    modifiedBy: {
      type: Schema.Types.ObjectId,
    },
    name: {
      required: true,
      type: String,
    },
    privateKeys: {
      type: Object,
    },
    status: {
      default: 'ACTIVE',
      enum: CHANNEL_STATUS,
      type: String,
    },
    type: {
      enum: CHANNEL_TYPE,
      type: String,
    },
    welcomeMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ChannelSchemaName = 'channel';

const ChannelModel = MONGO_CONNECTION.DEFAULT.model(
  ChannelSchemaName,
  ChannelSchema
);

export const ChannelModelProvider = {
  provide: ChannelSchemaName,
  useValue: ChannelModel,
};

export type Channel = InferSchemaType<typeof ChannelSchema>;
