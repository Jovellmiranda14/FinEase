// import React, { useState } from 'react';
// import { Text, TextInput, View, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
// import { getAuth, sendPasswordResetEmail, fetchSignInMethodsForEmail } from '@firebase/auth';

// const CustomButton = ({ title, onPress }) => (
//   <TouchableOpacity onPress={onPress} style={styles.button}>
//     <Text style={styles.buttonText}>{title}</Text>
//   </TouchableOpacity>
// );

// const ForgotPassword = ({ onBackToLogin }) => {
//   const [email, setEmail] = useState('');
//   const [resetMessage, setResetMessage] = useState('');
//   const auth = getAuth();

//   const handleResetPassword = async () => {
//     try {
//       // Check if the email is registered
//       const methods = await fetchSignInMethodsForEmail(auth, email);
//       if (methods.length === 0) {
//         // Email is not registered
//         setResetMessage('This email is not registered. Please enter a valid email.');
//         return;
//       }

//       // Email is registered, send the reset email
//       await sendPasswordResetEmail(auth, email);
//       setResetMessage('Password reset email sent. Please check your inbox.');
//     } catch (error) {
//       console.error('Error sending password reset email:', error.message);
//       setResetMessage('Failed to send password reset email. Please try again.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ImageBackground source={require('./assets/BI.png')} style={styles.backgroundImage}>
//         <View style={styles.content}>
//           <Text style={styles.title}>Forgot Password</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//             autoCapitalize="none"
//           />
//           <CustomButton title="Reset Password" onPress={handleResetPassword} />
//           {resetMessage ? <Text style={styles.resetMessage}>{resetMessage}</Text> : null}
//           <Text style={styles.loginText}>Back to Login Page?</Text>
//           <TouchableOpacity onPress={onBackToLogin}>
//             <Text style={styles.loginLink}>Login Now</Text>
//           </TouchableOpacity>
//         </View>
//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: 'cover',
//     width: '100%', 
//     height: '100%', 
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 136, 
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: 'white',
//   },
//   input: {
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: 'black',
//     borderRadius: 15,
//     padding: 10,
//     width: '160%',
//     height: 40,
//     marginBottom: 20,
//   },
//   resetMessage: {
//     marginTop: 20,
//     color: '#3498db',
//     textAlign: 'center',
//   },
//   loginText: {
//     marginTop: 20,
//     textAlign: 'center',
//     color: 'white',
//   },
//   loginLink: {
//     color: '#3498db',
//     fontWeight: 'bold',
//   },
//   button: {
//     marginTop: 20,
//     borderRadius: 15,
//     overflow: 'hidden',
//     borderWidth: 2,
//     borderColor: 'white',
//     width: '110%',
//     height: '7%',
//     backgroundColor: '#492FAA',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ForgotPassword;
