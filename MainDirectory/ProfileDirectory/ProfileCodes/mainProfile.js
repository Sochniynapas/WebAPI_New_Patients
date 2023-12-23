import {getProfileData, updateProfile} from "./profileFunctions.js";
import {checkUserToken} from "../../MainCodes/mainFunctions.js";


const profileForm = document.getElementById('save');
await getProfileData();
profileForm.addEventListener('click', updateProfile);
