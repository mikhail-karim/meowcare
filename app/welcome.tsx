// import CatBg from "@/assets/images/welcome-cat.jpg";
import { Link } from 'expo-router';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const { height } = Dimensions.get('window');

const WelcomePage = () => {
    return (
        <SafeAreaView style={styles.welcomePage}>
            <Image style={styles.welcomeCat1} resizeMode="cover" source={require("../assets/images/welcome-cat.jpg")} />
            <View style={styles.overlay} />

            <View style={styles.container}>
                <View style={[styles.columnWrapper, styles.columnFlexBox]}>
                    <View style={[styles.column, styles.columnFlexBox]}>
                        <View style={styles.content}>
                            <Text style={[styles.mainTitle, styles.texts]}>
                                Selamat datang di dunia MeowCare!
                            </Text>
                            <Text style={[styles.appOverview, styles.texts]}>
                                Platform untuk menghubungkan pecinta kucing dengan para anabul yang membutuhkan rumah, sambil memberikan edukasi dan dukungan komunitas.
                            </Text>
                        </View>
                        <View style={styles.actions}>
                            <Link href="/signin" style={styles.buttonShadowBox}>
                                <Text style={styles.button1}>Login</Text>
                            </Link>
                            <Link href="/signup" style={styles.buttonShadowBox}>
                                <Text style={styles.button1}>Sign Up</Text>
                            </Link>
                        </View>
                    </View>
                </View>
            </View>
            
            <Text style={[styles.copyright, styles.texts]}>
                ©2025 MeowCare. All Rights Reserved.
            </Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    texts: {
        color: "#fff",
        fontFamily: "VarelaRound-Regular"
    },
    columnFlexBox: {
        justifyContent: "center",
        alignItems: "center"
    },
    welcomeCat1: {
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
    },  
    copyright: {
        fontSize: 10,
        letterSpacing: 0.2,
        lineHeight: 14,
        textAlign: "center",
        color: "#fff",
        marginTop: 20,
        marginBottom: 10,
        alignSelf: "center",
        opacity: 0.7,
    },
    mainTitle: {
        fontSize: 36,
        letterSpacing: 0.4,
        lineHeight: 43,
        textAlign: "left",
        width: 327
    },
    appOverview: {
        fontSize: 18,
        letterSpacing: 0.2,
        lineHeight: 25,
        textAlign: "left",
        width: 327
    },
    content: {
        gap: 144,
        alignSelf: "stretch"
    },
    button1: {
        fontSize: 16,
        lineHeight: 26,
        fontWeight: "500",
        fontFamily: "VarelaRound-Regular",
        color: "#000",
        textAlign: "left"
    },
    buttonShadowBox: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        backgroundColor: "#f2f2f2",
        borderRadius: 100,
        shadowOpacity: 1,
        elevation: 2,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowColor: "rgba(0, 0, 0, 0.5)",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    actions: {
        gap: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    column: {
        height: 523,
        gap: 32,
        alignSelf: "stretch"
    },
    columnWrapper: {
        width: "100%",
    },
    welcomePage: {
        flex: 1,
        backgroundColor: "#fafafa",
        position: "relative",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
});

export default WelcomePage; 