import React, { useEffect } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage, hideMessage } from "react-native-flash-message";
import { globalColorsLight, globalColorsDark, globalStyles } from "../styles/global";
import { empty } from "../utils/utils";

let globalColors = globalColorsLight;

export default function Login({ navigation }) {
	// TODO: Change after development.
	const [url, setUrl] = React.useState("http://192.168.1.67/api/");
	const [password, setPassword] = React.useState("admin");
	const [secure, setSecure] = React.useState(false);

	// TODO: Remove after development.
	useEffect(() => {
		login();
	}, []);

	return (
		<View style={styles.container}>
			<TextInput placeholder="API URL..." onChangeText={(value) => setUrl(value)} value={url} style={styles.input}></TextInput>
			<TextInput placeholder="Password..." secureTextEntry={secure} value={password} onChangeText={(value) => textChanged(value)} style={styles.input}></TextInput>
			<TouchableOpacity onPress={() => login()}>
				<LinearGradient colors={[globalColors.accentFirst, globalColors.accentSecond]} style={styles.button} useAngle={true} angle={45}>
					<Text style={styles.text}>Login</Text>
				</LinearGradient>
			</TouchableOpacity>
		</View>
	);

	function textChanged(password) {
		setPassword(password);

		if(!empty(password)) {
			setSecure(true);
		} else {
			setSecure(false);
		}
	}

	function login() {
		if(empty(url) || empty(password)) {
			showMessage({
				backgroundColor: globalColors.accentFirst,
				message: "Error",
				description: "Both fields must be filled out.",
				duration: 4000
			});
		} else {
			let endpoint = url + "account/login.php?platform=app";

			let body = { password:password };

			fetch(endpoint, {
				body: JSON.stringify(body),
				method: "POST",
				headers: {
					Accept: "application/json", "Content-Type": "application/json"
				}
			})
			.then((json) => {
				return json.json();
			})
			.then(async (response) => {
				if("error" in response) {
					showMessage({
						backgroundColor: globalColors.accentFirst,
						message: "Error",
						description: response.error,
						duration: 4000
					});
				} else {
					if(response.valid) {
						let token = response.token;
						await AsyncStorage.setItem("api", url);
						await AsyncStorage.setItem("token", token);
						navigation.navigate("Dashboard");
					}
				}
			}).catch(error => {
				showMessage({
					backgroundColor: globalColors.accentFirst,
					message: "Error",
					description: "Login failed. Make sure the API URL is valid.",
					duration: 4000
				});
				console.log(error);
			});
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex:1,
		alignItems:"center",
		justifyContent:"center",
		backgroundColor:globalColors.mainSecond
	},
	input: {
		backgroundColor:globalColors.mainFirst,
		paddingLeft:10,
		paddingRight:10,
		width:160,
		height:40,
		marginBottom:20,
		borderRadius:globalStyles.borderRadius,
		backgroundColor:globalColors.mainFirst,
		shadowColor:globalStyles.shadowColor,
		shadowOffset:globalStyles.shadowOffset,
		shadowOpacity:globalStyles.shadowOpacity,
		shadowRadius:globalStyles.shadowRadius,
		elevation:globalStyles.shadowElevation,
	},
	button: {
		height:40,
		width:100,
		alignItems:"center",
		justifyContent:"center",
		borderRadius:globalStyles.borderRadius
	},
	text: {
		lineHeight:38,
		fontFamily:globalStyles.fontFamily,
		fontSize:18,
		paddingBottom:2,
		color:globalColors.accentContrast
	}
});