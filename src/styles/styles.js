import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    color: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headingTitle: {
    color: 'red',
    fontFamily: 'PoppinsBold',
    fontSize: '25@s',
  },

  subheadingTitle: {
    color: 'black',
    fontFamily: 'Poppins',
    fontSize: '14@s',
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: '10@vs',
    marginHorizontal: '50@s',
  },

  pageTitle: {
    fontFamily: 'PoppinsBold',
    color: 'red',
    fontSize: '25@s',
    marginTop: '10@vs',
    marginLeft: '-200@s',
    marginBottom: '-10@vs',
  },

  logoImage: {
    width: '170@s',
    height: '170@s',
    alignSelf: 'center',
    marginTop: '-40@vs',
  },

  textInput: {
    fontFamily: 'Poppins',
    fontSize: '15@s',
    width: '290@s',
    height: '50@vs',
    borderWidth: 0, 
    margin: '10@vs',
    paddingHorizontal: '10@s',
  },

  button: {
    fontFamily: 'PoppinsBold',
    fontSize: '18@s',
    paddingVertical: '10@vs',
    paddingHorizontal: '20@s',
    margin: '10@vs',
  },

  scrollContent: {
    padding: '20@s',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '10@vs',
  },

  checkboxLabel: {
    color: 'red',
    fontFamily: 'Poppins',
    fontSize: '12@s',
    marginLeft: '5@s',
    marginTop: '5@vs',
  },

  footerImage: {
    width: '100%',
    height: '200@vs',
  },

});

export default styles;
