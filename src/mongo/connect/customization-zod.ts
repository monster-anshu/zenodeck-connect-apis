import { z } from 'zod';

export const hexColor = z.string().regex(/^#(?:[0-9a-fA-F]{6})$/, {
  message: 'Invalid hex color',
});

const CustomizationSchemaZod = z.object({
  backgroundColor: hexColor,
  chatIcon: z.object({
    maximized: z.object({
      backgroundColor: hexColor,
      icon: z.string(),
      iconColor: hexColor,
    }),
    minimized: z.object({
      backgroundColor: hexColor,
      icon: z.string(),
      iconColor: hexColor,
    }),
    position: z.enum(['LEFT', 'RIGHT']),
  }),
  chatWindow: z.object({
    attachmentIcon: z.object({
      color: hexColor,
      enable: z.boolean(),
    }),
    backgroundColor: hexColor,
    botChatbox: z.object({
      backgroundColor: hexColor,
      textColor: hexColor,
    }),
    emojiIcon: z.object({
      activeColor: hexColor,
      color: hexColor,
      enable: z.boolean(),
    }),
    enterKeyToSendMessage: z.boolean(),
    hideBranding: z.boolean(),
    inputField: z.object({
      backgroundColor: hexColor,
      placeholder: z.string(),
      textColor: hexColor,
    }),
    sendButton: z.object({
      backgroundColor: hexColor,
      textColor: hexColor,
    }),
    userChatbox: z.object({
      backgroundColor: hexColor,
      textColor: hexColor,
    }),
  }),
  header: z.object({
    backgroundColor: hexColor,
    displayProfilePicture: z.boolean(),
    logo: z.string(),
    showLogo: z.boolean(),
    textColor: hexColor,
  }),
  homeContent: z.array(
    z.object({
      enable: z.boolean(),
      key: z.string(),
    })
  ),
  multiChat: z.object({
    enable: z.boolean(),
    submitButton: z.object({
      backgroundColor: hexColor,
      textColor: hexColor,
    }),
  }),
  navigation: z.array(
    z.object({
      enable: z.boolean(),
      key: z.string(),
    })
  ),
  preChat: z.object({
    enable: z.boolean(),
    submitButton: z.object({
      backgroundColor: hexColor,
      textColor: hexColor,
    }),
  }),
  primaryColor: hexColor,
  textColor: hexColor,
});

export type Configration = z.infer<typeof CustomizationSchemaZod>;
