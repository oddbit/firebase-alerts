export interface IGoogleChatCardButton {
  text: string;
  url: string;
}

export interface IGoogleChatCardSection {
  header: string;
  buttons?: IGoogleChatCardButton[];
}

export interface IGoogleChatCard {
  title: string;
  subtitle: string;
  imageUrl: string;
  sections?: IGoogleChatCardSection[];
}

/**
 *
 */
export class GoogleChatCardButton implements IGoogleChatCardButton {
  /**
   * Constructor.
   *
   * @param {IGoogleChatCardButton} button Button data
   */
  constructor(button: IGoogleChatCardButton) {
    this.text = button.text;
    this.url = button.url;
  }

  public text: string;
  public url: string;

  /**
   * Make JSON data from the object
   *
   * @see https://developers.google.com/chat/api/reference/rest/v1/cards
   *
   * @return {object} JSON data for a card button
   */
  public toJson():object {
    return {
      text: this.text,
      onClick: {
        openLink: {
          url: this.url,
        },
      },
    };
  }
}
/**
 *
 */
export class GoogleChatCardSection implements IGoogleChatCardSection {
  /**
   * Constructor.
   *
   * @param {IGoogleChatCardSection} section Section data
   */
  constructor(section: IGoogleChatCardSection) {
    this.header = section.header;
    this.buttons = (section.buttons ?? [])
        .map((button) => new GoogleChatCardButton(button));
  }

  public header: string;
  public isCollapsible = false;
  public readonly buttons: GoogleChatCardButton[];

  /**
   * Make JSON data from the object
   *
   * @see https://developers.google.com/chat/api/reference/rest/v1/cards
   *
   * @return {object} JSON data for card sections with buttons
   */
  public toJson():object {
    return {
      header: this.header,
      collapsible: this.isCollapsible,
      widgets: [
        {
          buttonList: {
            buttons: this.buttons.map((button) => button.toJson()),
          },
        },
      ],
    };
  }
}

/**
 *
 */
export class GoogleChatCard implements IGoogleChatCard {
  /**
   * Constructor.
   *
   * @param {IGoogleChatCard} card Card data
   */
  constructor(card: IGoogleChatCard) {
    this.id = Date.now() + "-" + Math.round((Math.random() * 10000));
    this.title = card.title;
    this.subtitle = card.subtitle;
    this.imageUrl = card.imageUrl;
    this.sections = (card.sections ?? [])
        .map((section) => new GoogleChatCardSection(section));
  }

  private readonly id: string;
  public title: string;
  public subtitle: string;
  public imageUrl: string;
  public readonly sections: GoogleChatCardSection[];

  /**
   * Make JSON data from the object
   *
   * @see https://developers.google.com/chat/api/reference/rest/v1/cards
   *
   * @return {object} JSON data for card sections with buttons
   */
  public toJson():object {
    return {
      cardsV2: [
        {
          cardId: this.id,
          card: {
            header: {
              title: this.title,
              subtitle: this.subtitle,
              imageUrl: this.imageUrl,
              imageType: "CIRCLE",
              imageAltText: "Avatar for " + this.title,
            },
            sections: this.sections.map((section) => section.toJson()),
          },
        },
      ],
    };
  }
}
