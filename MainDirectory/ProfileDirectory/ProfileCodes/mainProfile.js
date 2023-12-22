import {getProfileData, updateProfile} from "./profileFunctions.js";
import {checkUserToken} from "../../MainCodes/mainFunctions.js";

if(await checkUserToken() === false){
    window.location.href ="/";
}
else {
    const profileForm = document.getElementById('save');
    await getProfileData();
    profileForm.addEventListener('click', updateProfile);
}
