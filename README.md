# React Native Modal Hands-on Activity

## 1. Modal Definition and Props Table

Modal in React Native is a component used to display content above the current view, often used for dialogs, alerts, or extra actions.

| Prop                  | Description                                         | Syntax                                  |
|-----------------------|-----------------------------------------------------|-----------------------------------------|
| animationType         | Controls how the modal animates (slide, fade, none). | animationType="slide"                    |
| transparent          | Makes modal background transparent.                  | transparent={true}                       |
| visible              | Determines if modal is shown.                         | visible={modalVisible}                   |
| onRequestClose       | Required for Android back button / swipe dismiss.    | onRequestClose={() => setModalVisible(false)} |
| onShow               | Called when modal is fully visible.                   | onShow={() => console.log('Modal shown')} |
| onDismiss (iOS)      | Called when modal is dismissed.                        | onDismiss={() => alert('Modal closed')} |
| presentationStyle (iOS) | Controls how modal looks (fullScreen, pageSheet, formSheet) | presentationStyle="pageSheet"            |
| statusBarTranslucent (Android) | Allows modal to go under the system status bar. | statusBarTranslucent={true}              |
| supportedOrientations (iOS) | Allowed screen orientations for modal.           | supportedOrientations={['portrait','landscape']} |

## 2. Testing Modal Props and Observations

- The modal animationType prop changes how the modal appears and disappears:
  - "slide" slides the modal up from the bottom.
  - "fade" fades the modal in and out.
  - "none" shows the modal instantly without animation.
- The transparent prop makes the modal background see-through.
- onRequestClose is essential on Android to handle back button dismiss.
- onDismiss works only on iOS to detect when modal closes.
- presentationStyle changes modal appearance on iOS.
- statusBarTranslucent allows modal to extend under the status bar on Android.
- supportedOrientations restricts allowed screen orientations on iOS.

## 3. Observations on iOS vs Android Modal Behavior

- iOS supports onDismiss and presentationStyle props, which Android ignores.
- Android requires onRequestClose to handle hardware back button.
- Modal appearance and dismissal animations may differ slightly between platforms.
- statusBarTranslucent works only on Android to allow modal under status bar.
- Overall, modal behavior is consistent but platform-specific props enhance UX.

## 4. User Icon in Navigation Bar

- Added a Material Icons "person" icon on the right side of the navigation bar.
- This enhances UI by providing a user-related visual cue.

## 5. Deletable List Items

- Each goal list item has a delete icon.
- Tapping the delete icon removes the item from the list.

## 6. Running the App

- Install Expo CLI globally if not installed:
  ```
  npm install -g expo-cli
  ```
- Initialize the project (already done here).
- Run the app:
  ```
  expo start
  ```
- Use Expo Go app on iOS or Android device to scan the QR code and test.
- Test modal animations and list item deletion.
- Observe modal differences on iOS and Android.

## 7. Summary of Activity Performed

- Created a React Native Expo app demonstrating Modal usage.
- Defined modal props and created a table of their descriptions.
- Tested modal props with different animation types.
- Added a user icon to the navigation bar.
- Made list items deletable.
- Observed platform differences in modal behavior.

## 8. Personal Conclusions / Reflections

- React Native Modal is a versatile component for overlays.
- Platform-specific props are important for native-like behavior.
- Testing on both iOS and Android is essential to catch differences.
- Material Icons integration is straightforward and improves UI.
- Managing state for modal visibility and list items is key for UX.

## 9. Lessons Learned

- Modal props like animationType and transparent greatly affect UX.
- onRequestClose is critical for Android back button handling.
- iOS supports additional modal presentation styles.
- Expo Go simplifies cross-platform testing.
- React Native components can be combined to build interactive apps quickly.

## 10. Conclusion

This hands-on activity successfully demonstrated the implementation and testing of Modal components in React Native, along with additional UI enhancements like user icons and deletable list items. By exploring modal props, testing different animations, and observing platform-specific behaviors, we gained a comprehensive understanding of how to create interactive and user-friendly mobile applications. The use of Expo for development and testing streamlined the process, allowing for quick iterations and cross-platform compatibility. Overall, this activity highlighted the importance of platform-aware development and thorough testing to deliver polished React Native apps.

---

This completes the hands-on activity as requested.
