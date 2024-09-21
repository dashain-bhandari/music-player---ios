import { useEffect, useState } from "react"
import { getColors } from "react-native-image-colors";
import { IOSImageColors } from "react-native-image-colors/build/types"
import { colors } from "../constants/tokens";

export const useBackgroundColor=(img:string)=>{
const [imgcolors,setColors]=useState<IOSImageColors|null>();
console.log(img)
useEffect(()=>{
getColors(img,
    {
        fallback:colors.background,
        cache:true,
        key:img
    }
).then((colors)=>{
    console.log(colors)
    setColors(colors as IOSImageColors);
})
},[img])

return {imgcolors}
}