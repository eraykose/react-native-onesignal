import OneSignal from 'react-native-onesignal';
import * as React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { renderButtonView, renderFieldView } from './Helpers';
import { SubscribeFields } from './models/SubscribeFields';

export interface Props {
    subscribeFields: SubscribeFields;
}

export interface State {
    isSubscribed: boolean;
    isLocationShared: boolean;
    provideUserConsent: boolean;
    requireUserConsent: boolean;
    state: any;
}

class OSButtons extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const subscribeFields = props.subscribeFields;

        this.state = {
            isSubscribed: subscribeFields.isSubscribed,
            isLocationShared: false,
            provideUserConsent: false,
            requireUserConsent: false,
            state: {}
        };
    }

    async componentDidMount() {
        let state = await OneSignal.getDeviceState();
        this.setState({ state })
    }

    createSubscribeFields() {
        const { subscribeFields } = this.props;
        const { isSubscribed } = subscribeFields;
        const { isLocationShared } = this.state;
        const color = '#D45653';
        const elements = [];

        const subscribedButton = renderButtonView(
            isSubscribed ? "Unsubscribe" : "Subscribe",
            color,
            () => {
                console.log("Is Push Disabled:", isSubscribed);
                OneSignal.disablePush(isSubscribed);
            }
        );

        const promptForPush = renderButtonView(
            "Prompt for Push",
            color,
            () => {
                console.log("Prompting for push with user response...");
                OneSignal.promptForPushNotificationsWithUserResponse(response => {
                    console.log("User response:", response);
                });
            }
        );

        const setLocationShared = renderButtonView(
            isLocationShared ? "Unshare Location" : "Share Location",
            color,
            () => {
                console.log("Is Location Shared:", !isLocationShared);
                OneSignal.setLocationShared(!isLocationShared);
                this.setState({ isLocationShared : !isLocationShared });
            }
        );

        const promptLocationButton = renderButtonView(
            "Prompt Location",
            color,
            () => {
                console.log("Prompting Location");
                OneSignal.promptLocation();
            }
        );

        let email = ""; // TO DO: from user input
        const setEmailButton = renderButtonView(
            "Set Email",
            color,
            () => {
                console.log("Setting email...");
                let authCode; // SET AUTH CODE HERE
                OneSignal.setEmail(email, authCode);
            }
        );

        const logoutEmailButton = renderButtonView(
            "Logout Email",
            color,
            () => {
                console.log("Logging out of email...");
                OneSignal.logoutEmail();
            }
        );

        elements.push(subscribedButton, setLocationShared, promptLocationButton, setEmailButton, logoutEmailButton);

        if (Platform.OS === 'ios') {
            elements.push(promptForPush);
        }

        return elements;
    }

    createDeviceFields() {
        const color = "#051B2C";
        const elements = [];

        const deviceStateButton = renderButtonView("Get Device State", color, async () => {
            let deviceState = await OneSignal.getDeviceState();
            console.log("Device State:", deviceState);
        })

        const requireUserProvideConsent = renderButtonView(
            this.state.requireUserConsent ? "Remove User Privacy Consent Requirement" : "Require User Privacy Consent",
            color,
            () => {
                console.log("Require User Consent:", !this.state.requireUserConsent);
                OneSignal.setRequiresUserPrivacyConsent(!this.state.requireUserConsent);
                this.setState({ requireUserConsent : !this.state.requireUserConsent });
            }
        )

        const provideUserConsentButton = renderButtonView(
            this.state.provideUserConsent ? "Reject User Consent" : "Provide User Consent", color, async () => {
                console.log("Provide User Consent:", !this.state.provideUserConsent);
                OneSignal.provideUserConsent(!this.state.provideUserConsent);
                this.setState({ provideUserConsent: !this.state.provideUserConsent })
        })

        const userProvidedPrivacyConsent = renderButtonView("Did User Provide Privacy Consent", color, async () => {
            let didProvide = await OneSignal.userProvidedPrivacyConsent();
            console.log("Provided Privacy Consent: ", didProvide);
        })

        elements.push(
            deviceStateButton,
            requireUserProvideConsent,
            provideUserConsentButton,
            userProvidedPrivacyConsent,
            );
        return elements;
    }

    createNotificationFields() {
        const color = "#3A3DB3";
        const elements = [];

        const postNotificationButton = renderButtonView(
            "Post Notification",
            color,
            async () => {
                const { userId } = await OneSignal.getDeviceState();
                const notificationObj = {
                    contents: {en: "Message Body"},
                    include_player_ids: [userId]
                };
                const json = JSON.stringify(notificationObj);

                console.log('Attempting to send notification to '+userId);

                OneSignal.postNotification(json, (success) => {
                    console.log("Success:", success);
                }, (failure) => {
                    console.log("Failure:", failure );
                });
            }
        )

        let value = "1"; // TO DO: get this from user input
        const sendTagWithKey = renderButtonView(
            "Send tag with key myTag",
            color,
            async () => {
                OneSignal.sendTag("myTag", value);
            }
        )

        const getTags = renderButtonView("Get tags", color, async () => {
            console.log("Privacy consent required for getting tags");
            console.log("Getting tags...");
            OneSignal.getTags((tags) => {
                console.log("Tags:", tags);
            });
        });

        let key = "myTag"; // TO DO: get this from user input
        const deleteTagWithKey = renderButtonView("Delete Tag With Key", color, async () => {
            OneSignal.deleteTag(key);
        });

        const clearOneSignalNotificationsButton = renderButtonView("Clear OneSignal Notifications", color, async () => {
            OneSignal.clearOneSignalNotifications();
        })

        elements.push(
            postNotificationButton,
            sendTagWithKey,
            getTags,
            deleteTagWithKey,
            clearOneSignalNotificationsButton
        );

        return elements;
    }

    /**
     Create the fields necessary to test email with OneSignal SDK
     */
    createEmailFields() {
        let elements = [];
        const {
            email,
            isEmailLoading,
            isPrivacyConsentLoading
        } = this.state.state;

        // Email TextInput
        let emailTextInput = renderFieldView(
            "Email",
            email,
            (text:string) => {
                this.setState({ email:text });
            }
        );

        // Set Email Button
        let setEmailButton = renderButtonView(
            "Set Email",
            isEmailLoading || isPrivacyConsentLoading,
            () => {
                console.log('Attempting to set email: ' + email);
                this.setState({isEmailLoading:true}, () => {
                    // OneSignal setEmail
                    OneSignal.setEmail(email, null, (error) => {
                        if (error) {
                            console.log('Error while setting email: ' + email);
                        } else {
                            console.log('Success setting email: ' + email);
                        }

                        this.setState({isEmailLoading:false});
                    });
                });
            }
        );

        // Logout Email Button
        let logoutEmailButton = this.renderButtonView(
            "Logout Email",
            isEmailLoading || isPrivacyConsentLoading,
            () => {
                console.log('Attempting to logout email');
                this.setState({isEmailLoading:true}, () => {
                    // OneSignal logoutEmail
                    OneSignal.logoutEmail((error) => {
                        if (error) {
                            console.log('Error while logging out email');
                            //OneSignal.deleteTags(['a']);
                        } else {
                            console.log('Success logging out email');
                        }

                        this.setState({isEmailLoading:false});
                    });
                });
            }
        );
    }

    render() {
        return (
            <View style={ styles.root }>
                <View style={ styles.container }>
                    { this.createSubscribeFields() }
                    { this.createDeviceFields() }
                    { this.createNotificationFields() }
                </View>
            </View>
        );
    }
};

// styles
const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    alignSelf: 'center'
  },
  buttons: {
    flexDirection: 'row',
    minHeight: 70,
    alignItems: 'stretch',
    alignSelf: 'center',
    borderWidth: 5
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    flexWrap: 'wrap'
  },
  button: {
    flex: 1,
    paddingVertical: 0
  },
  greeting: {
    color: '#999',
    fontWeight: 'bold'
  }
});

export default OSButtons;