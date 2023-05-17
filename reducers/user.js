import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    token: "",
    prenom: "",
    pseudo: "",
    mail: "",
    password: "",
    photoProfil: "",
    preference: [],
    recetteFavoris: [],
    places: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUsers: (state, action) => {
      console.log(action.payload);
    },
    addPlace: (state, action) => {
      state.value.places.push(action.payload);
    },
    removePlace: (state, action) => {
      state.value.places = state.value.places.filter(
        (e) => e.name !== action.payload
      );
    },
    // email: (state, action) => {
    //   state.value.token.email.push(action.payload);
    // },
    // password: (state, action) => {
    //   state.value.token.password.push(action.payload);
    // },
    // photoProfil: (state, action) => {
    //   state.value.token.photoProfil.push(action.payload);
    // },
    // allergies: (state, action) => {
    //   state.value.allergies = state.value.token.allergies.filter.push(
    //     action.payload
    //   );
    // },
    // preferences: (state, action) => {
    //   state.value.preferences = state.value.token.preferences.filter.push(
    //     action.payload
    //   );
    // },
    // NbPersonnes: (state, action) => {
    //   state.value.token.NbPersonnes.push(action.payload);
    // },
  },
});
export const { addPlace, removePlace } = userSlice.actions;
export default userSlice.reducer;
