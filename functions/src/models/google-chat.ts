interface OpenLink {
  url: string;
}

interface OnClick {
  openLink: OpenLink;
}

interface Button {
  text: string;
  onClick: OnClick;
}

interface ButtonList {
  buttons: Button[];
}

interface DecoratedText {
  topLabel: string;
  text: string;
}

interface Widget {
  decoratedText?: DecoratedText;
  buttonList?: ButtonList;
}

interface Section {
  header: string;
  widgets: Widget[];
}

interface Header {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageType: string;
  imageAltText: string;
}

interface Card {
  header: Header;
  sections: Section[];
}

export interface GoogleChatCard {
  cardId: string;
  card: Card;
}
