import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Mask, Path, Rect } from 'react-native-svg';

interface IconProps {
  isActive?: boolean;
}

export const WifiIcon: React.FC = () => (
  <Svg width={15} height={11} viewBox="0 0 15 11" fill="none">
    <Path
      d="M1.5 4.5C3.5 2.5 6 1.5 7.5 1.5C9 1.5 11.5 2.5 13.5 4.5M3 6.5C4.5 5.5 6 5 7.5 5C9 5 10.5 5.5 12 6.5M5 8.5C6 8 6.75 7.75 7.5 7.75C8.25 7.75 9 8 10 8.5M7.5 10.5C7.5 10.5 7.5 10.5 7.5 10.5"
      stroke="#313131"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BackArrowIcon: React.FC = () => (
  <Svg width={25} height={24} viewBox="0 0 25 24" fill="none">
    <Path
      d="M14.0478 6.29289L9.75488 10.5858C8.97383 11.3668 8.97383 12.6332 9.75488 13.4142L14.0478 17.7071C14.4383 18.0976 15.0715 18.0976 15.462 17.7071C15.8525 17.3166 15.8525 16.6834 15.462 16.2929L11.1691 12L15.462 7.70711C15.8525 7.31658 15.8525 6.68342 15.462 6.29289C15.0715 5.90237 14.4383 5.90237 14.0478 6.29289Z"
      fill="white"
    />
  </Svg>
);

export const SearchIcon: React.FC = () => (
  <Svg width={17} height={16} viewBox="0 0 17 16" fill="none">
    <G opacity={0.5}>
      <Path
        d="M12.3373 10.9326L15.4022 13.9974C15.6625 14.2578 15.6625 14.6799 15.4022 14.9403C15.1418 15.2006 14.7197 15.2006 14.4594 14.9403L11.3945 11.8754C10.3681 12.6965 9.06609 13.1875 7.64941 13.1875C4.33571 13.1875 1.64941 10.5012 1.64941 7.1875C1.64941 3.87379 4.33571 1.1875 7.64941 1.1875C10.9631 1.1875 13.6494 3.87379 13.6494 7.1875C13.6494 8.60418 13.1584 9.90618 12.3373 10.9326ZM7.64941 11.8542C10.2267 11.8542 12.3161 9.76483 12.3161 7.1875C12.3161 4.61017 10.2267 2.52083 7.64941 2.52083C5.07209 2.52083 2.98275 4.61017 2.98275 7.1875C2.98275 9.76483 5.07209 11.8542 7.64941 11.8542Z"
        fill="#313131"
      />
    </G>
  </Svg>
);

export const FilterIcon: React.FC = () => (
  <Svg width={21} height={13} viewBox="0 0 21 13" fill="none">
    <Path
      d="M8.29121 11C7.87937 12.1652 6.76813 13 5.46191 13C4.1557 13 3.04446 12.1652 2.63262 11H1.46191C0.909629 11 0.461914 10.5523 0.461914 10C0.461914 9.44772 0.909629 9 1.46191 9H2.63262C3.04446 7.83481 4.1557 7 5.46191 7C6.76813 7 7.87937 7.83481 8.29121 9H19.4619C20.0142 9 20.4619 9.44772 20.4619 10C20.4619 10.5523 20.0142 11 19.4619 11H8.29121ZM18.2912 4C17.8794 5.16519 16.7681 6 15.4619 6C14.1557 6 13.0445 5.16519 12.6326 4H1.46191C0.909629 4 0.461914 3.55228 0.461914 3C0.461914 2.44772 0.909629 2 1.46191 2H12.6326C13.0445 0.834808 14.1557 0 15.4619 0C16.7681 0 17.8794 0.834808 18.2912 2H19.4619C20.0142 2 20.4619 2.44772 20.4619 3C20.4619 3.55228 20.0142 4 19.4619 4H18.2912ZM15.4619 4C16.0142 4 16.4619 3.55228 16.4619 3C16.4619 2.44772 16.0142 2 15.4619 2C14.9096 2 14.4619 2.44772 14.4619 3C14.4619 3.55228 14.9096 4 15.4619 4ZM5.46191 11C6.0142 11 6.46191 10.5523 6.46191 10C6.46191 9.44772 6.0142 9 5.46191 9C4.90963 9 4.46191 9.44772 4.46191 10C4.46191 10.5523 4.90963 11 5.46191 11Z"
      fill="white"
    />
  </Svg>
);

export const LocationIcon: React.FC = () => (
  <Svg width={14} height={16} viewBox="0 0 14 16" fill="none">
    <Path
      d="M7.2494 14.0969C6.84908 14.4273 6.27071 14.4273 5.87039 14.0969C2.91824 11.6609 1.41406 9.27281 1.41406 6.91683C1.41406 4.07486 3.71793 1.771 6.5599 1.771C9.40186 1.771 11.7057 4.07486 11.7057 6.91683C11.7057 9.27281 10.2016 11.6609 7.2494 14.0969ZM10.6224 6.91683C10.6224 4.67317 8.80355 2.85433 6.5599 2.85433C4.31624 2.85433 2.4974 4.67317 2.4974 6.91683C2.4974 8.89087 3.83283 11.011 6.5599 13.2613C9.28697 11.011 10.6224 8.89087 10.6224 6.91683ZM6.5599 8.54183C5.36328 8.54183 4.39323 7.57178 4.39323 6.37516C4.39323 5.17855 5.36328 4.2085 6.5599 4.2085C7.75651 4.2085 8.72656 5.17855 8.72656 6.37516C8.72656 7.57178 7.75651 8.54183 6.5599 8.54183ZM6.5599 7.4585C7.1582 7.4585 7.64323 6.97347 7.64323 6.37516C7.64323 5.77685 7.1582 5.29183 6.5599 5.29183C5.96159 5.29183 5.47656 5.77685 5.47656 6.37516C5.47656 6.97347 5.96159 7.4585 6.5599 7.4585Z"
      fill="#6E6E6E"
    />
  </Svg>
);

export const GenderIcon: React.FC<{ gender?: string }> = ({ gender }) => (
  <View style={styles.genderContainer}>
    <Svg width={13} height={12} viewBox="0 0 13 12" fill="none">
      <Mask id="mask0" maskType="luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="13" height="12">
        <Path d="M12.4805 0.53857V11.4614H0.961914V0.53857H12.4805Z" fill="white" stroke="white" />
      </Mask>
      <G mask="url(#mask0)">
        <Path
          d="M5.80807 10.7189C8.04065 10.7189 9.85052 8.9953 9.85052 6.86899C9.85052 4.74272 8.04065 3.01904 5.80807 3.01904C3.57549 3.01904 1.76562 4.74272 1.76562 6.86899C1.76562 8.9953 3.57549 10.7189 5.80807 10.7189Z"
          stroke="#7C7D82"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M11.676 1.28027L8.80713 4.0125"
          stroke="#7C7D82"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.28516 1.28027H11.6756V4.50927"
          stroke="#7C7D82"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  genderText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6E6E6E',
    fontFamily: 'Poppins-Regular',
  },
});

export const AgeIcon: React.FC = () => (
  <View className="flex-row items-center">
    <Svg width={13} height={12} viewBox="0 0 13 12" fill="none">
      <Path
        d="M11.0641 8.1377C10.725 6.10922 8.77696 4.45996 6.71972 4.45996C4.48432 4.45996 2.51903 6.27012 2.32939 8.4998C2.25469 9.3617 2.53052 10.1777 3.09942 10.7926C3.66258 11.4075 4.45559 11.7465 5.31756 11.7465H8.00693C8.97808 11.7465 9.82856 11.3673 10.409 10.6834C10.9894 9.9996 11.2192 9.0916 11.0641 8.1377Z"
        fill="#7C7D82"
      />
      <Path
        d="M6.00744 3.62086C6.93734 3.62086 7.69116 2.86703 7.69116 1.93714C7.69116 1.00725 6.93734 0.25342 6.00744 0.25342C5.07755 0.25342 4.32373 1.00725 4.32373 1.93714C4.32373 2.86703 5.07755 3.62086 6.00744 3.62086Z"
        fill="#7C7D82"
      />
      <Path
        d="M9.83427 4.29305C10.6087 4.29305 11.2364 3.6653 11.2364 2.89091C11.2364 2.11653 10.6087 1.48877 9.83427 1.48877C9.05987 1.48877 8.43213 2.11653 8.43213 2.89091C8.43213 3.6653 9.05987 4.29305 9.83427 4.29305Z"
        fill="#7C7D82"
      />
      <Path
        d="M11.9087 6.53408C12.5275 6.53408 13.0292 6.03241 13.0292 5.41352C13.0292 4.79466 12.5275 4.29297 11.9087 4.29297C11.2898 4.29297 10.7881 4.79466 10.7881 5.41352C10.7881 6.03241 11.2898 6.53408 11.9087 6.53408Z"
        fill="#7C7D82"
      />
      <Path
        d="M2.36406 5.41366C3.13843 5.41366 3.7662 4.7859 3.7662 4.01152C3.7662 3.23713 3.13843 2.60938 2.36406 2.60938C1.58968 2.60938 0.961914 3.23713 0.961914 4.01152C0.961914 4.7859 1.58968 5.41366 2.36406 5.41366Z"
        fill="#7C7D82"
      />
    </Svg>
  </View>
);

export const HomeIcon: React.FC<IconProps> = ({ isActive }) => (
  <Svg width={27} height={26} viewBox="0 0 27 26" fill="none">
    <G clipPath="url(#clip0_home)">
      <Mask id="mask0_home" maskType="luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="27">
        <Path d="M27.9619 0H0.961914V27H27.9619V0Z" fill="white" />
      </Mask>
      <G mask="url(#mask0_home)">
        <Path
          d="M3.21191 24.7495H25.7119"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4.28125 24.749L4.3375 11.2152C4.3375 10.5289 4.66375 9.87648 5.20375 9.44898L13.0788 3.31771C13.8888 2.68771 15.0251 2.68771 15.8463 3.31771L23.7213 9.43771C24.2726 9.86521 24.5876 10.5177 24.5876 11.2152V24.749"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinejoin="round"
        />
        <Path
          d="M18.4004 12.3745H10.5254C9.59164 12.3745 8.83789 13.1283 8.83789 14.062V24.7495H20.0879V14.062C20.0879 13.1283 19.3341 12.3745 18.4004 12.3745Z"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12.2129 18.2808V19.9683"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12.7744 8.4375H16.1494"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="clip0_home">
        <Rect width="26" height="26" fill="white" transform="translate(0.961914)" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const ReportIcon: React.FC<IconProps> = ({ isActive }) => (
  <Svg width={25} height={25} viewBox="0 0 25 25" fill="none">
    <G clipPath="url(#clip0_report)">
      <Mask id="mask0_report" maskType="luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="25">
        <Path d="M24.9619 0.0170898H0.961914V24.0171H24.9619V0.0170898Z" fill="white" />
      </Mask>
      <G mask="url(#mask0_report)">
        <Path
          d="M2.96191 22.0171H22.9619"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12.9619 6.01709C7.99191 6.01709 3.96191 10.0471 3.96191 15.0171V22.0171H21.9619V15.0171C21.9619 10.0471 17.9319 6.01709 12.9619 6.01709Z"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12.9619 2.01709V3.01709"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M4.96191 4.01709L5.96191 5.01709"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M20.9619 4.01709L19.9619 5.01709"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="clip0_report">
        <Rect width="24" height="24" fill="white" transform="translate(0.961914 0.0170898)" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const AdoptionIcon: React.FC<IconProps> = ({ isActive }) => (
  <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
    <G clipPath="url(#clip0_adoption)">
      <Mask id="mask0_adoption" maskType="luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="26" height="26">
        <Path d="M25.4619 0.0170898H0.461914V25.0171H25.4619V0.0170898Z" fill="white" />
      </Mask>
      <G mask="url(#mask0_adoption)">
        <Path
          d="M20.337 16.3927C19.7224 12.7156 16.1912 9.72607 12.462 9.72607C8.40996 9.72607 4.84746 13.0073 4.50371 17.049C4.36829 18.6115 4.86829 20.0906 5.89954 21.2052C6.92037 22.3198 8.35787 22.9344 9.92037 22.9344H14.7953C16.5558 22.9344 18.0974 22.2469 19.1495 21.0073C20.2016 19.7677 20.6183 18.1219 20.337 16.3927Z"
          fill={isActive ? "#313131" : "#9CA3AF"}
        />
        <Path
          d="M11.1702 8.20475C12.8559 8.20475 14.2223 6.83828 14.2223 5.15267C14.2223 3.46705 12.8559 2.10059 11.1702 2.10059C9.48462 2.10059 8.11816 3.46705 8.11816 5.15267C8.11816 6.83828 9.48462 8.20475 11.1702 8.20475Z"
          fill={isActive ? "#313131" : "#9CA3AF"}
        />
        <Path
          d="M18.1076 9.42366C19.5113 9.42366 20.6493 8.28573 20.6493 6.882C20.6493 5.47828 19.5113 4.34033 18.1076 4.34033C16.7038 4.34033 15.5659 5.47828 15.5659 6.882C15.5659 8.28573 16.7038 9.42366 18.1076 9.42366Z"
          fill={isActive ? "#313131" : "#9CA3AF"}
        />
        <Path
          d="M21.8682 13.4854C22.99 13.4854 23.8994 12.576 23.8994 11.4541C23.8994 10.3323 22.99 9.42285 21.8682 9.42285C20.7463 9.42285 19.8369 10.3323 19.8369 11.4541C19.8369 12.576 20.7463 13.4854 21.8682 13.4854Z"
          fill={isActive ? "#313131" : "#9CA3AF"}
        />
        <Path
          d="M4.56608 11.4544C5.9698 11.4544 7.10775 10.3165 7.10775 8.91276C7.10775 7.50903 5.9698 6.37109 4.56608 6.37109C3.16236 6.37109 2.02441 7.50903 2.02441 8.91276C2.02441 10.3165 3.16236 11.4544 4.56608 11.4544Z"
          fill={isActive ? "#313131" : "#9CA3AF"}
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="clip0_adoption">
        <Rect width="25" height="25" fill="white" transform="translate(0.461914 0.0170898)" />
      </ClipPath>
    </Defs>
  </Svg>
);

export const EducationIcon: React.FC<IconProps> = ({ isActive }) => (
  <Svg width={25} height={25} viewBox="0 0 25 25" fill="none">
    <G clipPath="url(#clip0_education)">
      <Mask id="mask0_education" maskType="luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="25">
        <Path d="M24.4619 0.0170898H0.461914V24.0171H24.4619V0.0170898Z" fill="white" />
      </Mask>
      <G mask="url(#mask0_education)">
        <Path
          d="M22.4619 16.7568V4.68679C22.4619 3.48679 21.4819 2.59679 20.2919 2.69679H20.2319C18.1319 2.87679 14.9419 3.94679 13.1619 5.06679L12.9919 5.17679C12.7019 5.35679 12.2219 5.35679 11.9319 5.17679L11.6819 5.02679C9.90191 3.91679 6.72191 2.85679 4.62191 2.68679C3.43191 2.58679 2.46191 3.48679 2.46191 4.67679V16.7568C2.46191 17.7168 3.24191 18.6168 4.20191 18.7368L4.49191 18.7768C6.66191 19.0668 10.0119 20.1668 11.9319 21.2168L11.9719 21.2368C12.2419 21.3868 12.6719 21.3868 12.9319 21.2368C14.8519 20.1768 18.2119 19.0668 20.3919 18.7768L20.7219 18.7368C21.6819 18.6168 22.4619 17.7168 22.4619 16.7568Z"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12.4619 5.50732V20.5073"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.21191 8.50732H5.96191"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.96191 11.5073H5.96191"
          stroke={isActive ? "#313131" : "#9CA3AF"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="clip0_education">
        <Rect width="24" height="24" fill="white" transform="translate(0.461914 0.0170898)" />
      </ClipPath>
    </Defs>
  </Svg>
);
