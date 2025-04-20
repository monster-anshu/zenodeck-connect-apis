import { Configration } from '~/mongo/connect/customization-zod';

export const defaultConfig: Configration = {
  primaryColor: '#B51F1F',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  chatIcon: {
    // bottomSpacing: 56,
    // enable: true,
    // greetingPopUpInterval: 5,
    maximized: {
      backgroundColor: '#ffffff',
      icon: 'https://assets.orufy.com/down_arrow2_757d373883.svg',
      iconColor: '#ffffff',
    },
    minimized: {
      backgroundColor: '#B51F1F',
      icon: 'https://assets.orufy.com/chat_Bubble_Ellipsis_b6c4f1832b_77e3b64276.svg',
      iconColor: '#ffffff',
    },
    position: 'RIGHT',
    // presentation: "SLIDE_UP",
    // sideSpacing: 16,
    // size: "STANDARD",
  },
  // chatReplyExpectation: {
  //   enable: true,
  //   replyTime: "LESS_THAN_1_MINUTE",
  // },
  chatWindow: {
    attachmentIcon: {
      color: 'black',
      enable: true,
    },
    backgroundColor: '#ffffff',
    botChatbox: {
      backgroundColor: '#ffffff',
      textColor: 'black',
    },
    emojiIcon: {
      activeColor: 'black',
      color: '#ffffff',
      enable: true,
    },
    enterKeyToSendMessage: true,
    hideBranding: false,
    inputField: {
      backgroundColor: '#ffffff',
      placeholder: '',
      textColor: 'black',
    },
    sendButton: {
      backgroundColor: '#ffffff',
      textColor: '#c2c2c2',
    },
    userChatbox: {
      backgroundColor: '#ffffff',
      textColor: 'black',
    },
  },
  header: {
    backgroundColor:
      'linear-gradient(to top, rgb(228, 193, 255), rgb(128, 93, 207))',
    displayProfilePicture: true,
    // headerType: "LINEAR",
    logo: '',
    showLogo: false,
    textColor: '#ffffff',
  },
  homeContent: [
    {
      enable: false,
      key: 'HEADER',
    },
    {
      enable: true,
      key: 'LAST_MESSAGE',
    },
    {
      enable: true,
      key: 'SEND_MESSAGE',
    },
    {
      enable: true,
      key: 'FAQ',
    },
    {
      enable: true,
      key: 'TICKETS',
    },
  ],
  multiChat: {
    submitButton: {
      backgroundColor: '#675CC0',
      textColor: '#ffffff',
    },
    enable: true,
  },
  navigation: [
    {
      enable: true,
      key: 'HOME',
    },
    {
      enable: true,
      key: 'CHATS',
    },
    {
      enable: true,
      key: 'FAQS',
    },
    {
      enable: true,
      key: 'TICKETS',
    },
  ],
  preChat: {
    enable: true,
    submitButton: {
      backgroundColor: '#675CC0',
      textColor: '#ffffff',
    },
  },
  // ticket: {
  //   ticketCreateEnable: true,
  // },
};
