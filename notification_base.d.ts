import { OSCreateNotificationDelayOption } from 'react-native-onesignal/src/defines';
export declare class OSActionButton {
    /** The custom identifier for this button/action */
    id: String;
    /** The title for the button */
    title: String;
    /** Android only - the URL/filename for the icon */
    icon?: String;
    /** constructor function */
    constructor(id: String, title: String, icon?: String);
    jsonRepresentation(): any;
}
export declare class OSNotificationBase {
    /** The notification's content (body) */
    content?: String;
    /** The title/heading for the notification */
    heading?: String;
    /** The subtitle for the notification (iOS 10+ only) */
    subtitle?: String;
    /** Tells the app to launch in the background (iOS only) */
    contentAvailable?: Boolean;
    /**
     * Tells the app to launch the Notification Service extension,
     * which can mutate your notification (ie. download attachments)
     */
    mutableContent?: Boolean;
    /** Additional data you wish to send with the notification */
    additionalData?: Object;
    /** The URL to open when the user taps the notification */
    url?: String;
    /**
     * Media (images, videos, etc.) for iOS. Maps a custom
     * ID to a resource URL in the format {'id' : 'https://.....'}
     */
    iosAttachments?: Map<String, String>;
    /** An image to use as the big picture (android only) */
    bigPicture?: String;
    /** A list of buttons to attach to the notification */
    buttons?: Array<OSActionButton>;
    /**
     * The category identifier for iOS (controls various aspects
     * of the notification, for example, whether to launch a
     * Notification Content Extension) (iOS only)
     */
    iosCategory?: String;
    /**
     * A small icon (Android only)
     * Can be a drawable resource name or a URL
    */
    androidSmallIcon?: String;
    /**
     * A large icon (Android only)
     * Can be a drawable resource name or a URL
    */
    androidLargeIcon?: String;
    /** The Android Oreo Notification Category to send the notification under */
    androidChannelId?: String;
    /**
     * If multiple notifications have the same collapse ID, only the most
     * recent notification will be shown. (For iOS 12+ thread ID is preferred)
     */
    collapseId?: String;
    /** Allows you to send a notification at a specific date */
    sendAfter?: Date;
    /** Allows you to control how the notification is delayed */
    delayOption?: OSCreateNotificationDelayOption;
    /**
     * Used in conjunction with delayedOption == timezone, lets you specify what
     * time of day each user should receive the notification, ie. "9:00 AM"
     */
    deliveryTimeOfDay?: String;
    /** The Thread-ID for this notification (iOS 12+) */
    iosThreadId?: String;
    constructor(nativeJson: any);
}