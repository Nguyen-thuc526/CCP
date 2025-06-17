// store/slices/certificateSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Certification } from "@/types/certification"

interface CertificateState {
  selectedCertificate: Certification | null
}

const initialState: CertificateState = {
  selectedCertificate: null,
}

const certificateSlice = createSlice({
  name: "certificate",
  initialState,
  reducers: {
    setSelectedCertificate: (state, action: PayloadAction<Certification>) => {
      state.selectedCertificate = action.payload
    },
    clearSelectedCertificate: (state) => {
      state.selectedCertificate = null
    },
  },
})

export const { setSelectedCertificate, clearSelectedCertificate } = certificateSlice.actions

const certificateReducer = certificateSlice.reducer;
export default certificateReducer;