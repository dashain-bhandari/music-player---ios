import {StackNavigationOptions} from "@react-navigation/stack";
import { colors } from "./tokens";

export const StackScreenWIthSearch:StackNavigationOptions={

headerStyle:{
    backgroundColor:colors.background,

},
headerTitleStyle:{
    color:colors.text,
    fontSize:32,
   
},
headerTitleAlign:"left",
headerShadowVisible:false, 
// headerTransparent:true
//white line appearing under header


}
