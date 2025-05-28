export const fonts = {
  header: {
    fontFamily: 'VarelaRound-Regular',
  },
  body: {
    regular: {
      fontFamily: 'Poppins-Regular',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
    },
    semiBold: {
      fontFamily: 'Poppins-SemiBold',
    },
    bold: {
      fontFamily: 'Poppins-Bold',
    },
  },
}

export const typography = {
  header: {
    large: {
      ...fonts.header,
      fontSize: 32,
    },
    medium: {
      ...fonts.header,
      fontSize: 24,
    },
    small: {
      ...fonts.header,
      fontSize: 20,
    },
  },
  body: {
    large: {
      regular: {
        ...fonts.body.regular,
        fontSize: 18,
      },
      medium: {
        ...fonts.body.medium,
        fontSize: 18,
      },
      semiBold: {
        ...fonts.body.semiBold,
        fontSize: 18,
      },
      bold: {
        ...fonts.body.bold,
        fontSize: 18,
      },
    },
    medium: {
      regular: {
        ...fonts.body.regular,
        fontSize: 16,
      },
      medium: {
        ...fonts.body.medium,
        fontSize: 16,
      },
      semiBold: {
        ...fonts.body.semiBold,
        fontSize: 16,
      },
      bold: {
        ...fonts.body.bold,
        fontSize: 16,
      },
    },
    small: {
      regular: {
        ...fonts.body.regular,
        fontSize: 14,
      },
      medium: {
        ...fonts.body.medium,
        fontSize: 14,
      },
      semiBold: {
        ...fonts.body.semiBold,
        fontSize: 14,
      },
      bold: {
        ...fonts.body.bold,
        fontSize: 14,
      },
    },
  },
}

const theme = {
  fonts,
  typography,
}

export default theme; 