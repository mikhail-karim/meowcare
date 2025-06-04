import { ViewStyle } from 'react-native';

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

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
}

export const colors = {
  primary: '#222E3A',
  secondary: '#CBD5E1',
  background: '#FFFFFF',
  text: {
    primary: '#222222',
    secondary: '#666666',
  },
  overlay: 'rgba(0,0,0,0.25)',
  surface: {
    light: '#F8FAFC',
    medium: '#F1F5F9',
    dark: '#E2E8F0',
  },
  feedback: {
    success: '#222E3A',
  },
  icon: {
    primary: '#222E3A',
    secondary: '#666666',
  },
}

export const container: Record<string, ViewStyle> = {
  screen: {
    paddingTop: 15,
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    position: 'relative',
    backgroundColor: colors.background,
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
}

const theme = {
  fonts,
  typography,
  spacing,
  colors,
  container,
}

export default theme; 