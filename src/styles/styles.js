import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins'
  },

  header: {
    color: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headingTitle: {
    color: 'red',
    fontFamily: 'PoppinsBold',
    fontSize: 26,
  },
  
  subheadingTitle: {
    color: 'black',
    fontFamily: 'Poppins',
    fontSize: 14,
    alignSelf: 'center',
    textAlign:'center',
    marginTop: 1,
    marginHorizontal: 50
  },

  pageTitle: {
    fontFamily: 'PoppinsBold',
    marginTop: 10,
    color: 'red',
    fontSize: 25,
    marginLeft: -210,
    marginBottom: -10
  },

  logoImage: {
    width: 170,
    height: 170,
    alignSelf: 'center',
    marginTop: -80,
  },

  textInput: {
    fontFamily: "Poppins",
    fontSize: 15,
    width: 290,
    height: 50,  
    borderColor: '#6edf3e', 
    margin: 10,
  },

  button: {
    fontFamily: 'PoppinsBold',
    fontSize: 20,
    paddingVertical: 7, 
    paddingHorizontal: 15, 
    margin: 10,
  },

  scrollContent: {
    padding: 26,
  },

  checkboxContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    fontFamily: "Poppins",
    marginTop: -10
  },
  checkboxLabel: {
    color: 'red', 
    marginLeft: 8,
    marginTop: 15,
    fontFamily: "Poppins", 
    fontSize: 12, 
    marginLeft:-1
  },

  footerImage: {
    width: '100%',
    height: 300,
  },
  
});

export default styles;
