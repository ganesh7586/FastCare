import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctor.model.js';
import appointmentModel from '../models/appointment.model.js';

const registerUser = async (req,res) =>{
    try {
    const {name,email,password} = req.body;

    if(!name || !email || !password){
       return res.json({success:false,message:'invalid credentials'})
    }
    if(!validator.isEmail(email)){
       return res.json({success:false,message:'invalid email'});
    }
    if(password.length <8){
        return res.json({success:false,message:'Enter strong password of lenght above 7'})
    }
    
    const existingUser = await userModel.findOne({email});

    if(existingUser){
        return res.json({success:false,message:'user already exist with email'})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedpassword =await bcrypt.hash(password,salt);

    const userData = {
        name,
        email,
        password:hashedpassword
    }
    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

    res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const userLogin = async (req,res) =>{
   try {
     const {email,password} = req.body
    if(!email || !password){
        return res.json({success:false,message:'Enter email and password'})
    }
    const user =await userModel.findOne({email});

    if(!user){
        return res.json({success:false,message:'User not found Register Frst'})
    }
    const isPasswordTrue = await bcrypt.compare(password,user.password)

    if(!isPasswordTrue){
        return res.json({success:false,message:'Invalid Password'})
    } else{
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        return res.json({success:true,message:'Login Successfull',token})
    }
   } catch (error) {
    console.log(error);
     res.json({success:false,message:error.message})
   }
}

//api to get user data

const getProfile = async (req,res) =>{
    try {
        const userId = req.body.userId || req.userId;
        const userData = await userModel.findById(userId).select('-password')
        res.json({success:true,userData})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update userProfile

// API to update user profile data
const updateProfile = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        // Parse address if sent as a JSON string (e.g., via FormData)
        let parsedAddress = address;
        if (typeof address === 'string') {
            try {
                parsedAddress = JSON.parse(address);
            } catch (err) {
                // Keep as is if already parsed
            }
        }

        // Update user fields
        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: parsedAddress,
            dob,
            gender
        });

        // Upload new image if provided
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            const imageUrl = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, { image: imageUrl });
        }

        res.json({ success: true, message: "Profile Updated" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        const { docId, slotDate, slotTime } = req.body;

        if (!docId || !slotDate || !slotTime || !/^\d{1,2}_\d{1,2}_\d{4}$/.test(String(slotDate)) || !String(slotTime).trim()) {
            return res.json({ success: false, message: 'Missing appointment details' });
        }

        const docData = await doctorModel.findById(docId).select('-password');
        if (!docData) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor is not available' });
        }

        const userData = await userModel.findById(userId).select('-password');
        if (!userData) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Reserve the slot in one database operation so two simultaneous requests
        // cannot create appointments for the same doctor and time.
        const slotPath = `slots_booked.${slotDate}`;
        const reservedDoctor = await doctorModel.findOneAndUpdate(
            { _id: docId, available: true, [slotPath]: { $ne: slotTime } },
            { $addToSet: { [slotPath]: slotTime } },
            { new: false }
        );

        if (!reservedDoctor) {
            return res.json({ success: false, message: 'Slot not available' });
        }

        const docSnapshot = docData.toObject ? docData.toObject() : { ...docData };
        delete docSnapshot.slots_booked;
        delete docSnapshot.email;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: docSnapshot,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        try {
            const newAppointment = new appointmentModel(appointmentData);
            await newAppointment.save();
        } catch (saveError) {
            // Do not leave a slot blocked when persisting the appointment fails.
            await doctorModel.findByIdAndUpdate(docId, {
                $pull: { [slotPath]: slotTime }
            });
            throw saveError;
        }

        res.json({ success: true, message: 'Appointment Booked' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        const appointments = await appointmentModel.find({ userId }).sort({ date: -1 });

        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findOneAndUpdate(
            { _id: appointmentId, userId, cancelled: false, isCompleted: false },
            { $set: { cancelled: true } },
            { new: false }
        );

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment cannot be cancelled' });
        }

        const { docId, slotDate, slotTime } = appointmentData;
        await doctorModel.findByIdAndUpdate(docId, {
            $pull: { [`slots_booked.${slotDate}`]: slotTime }
        });

        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to make payment of appointment using online simulation
const paymentAppointment = async (req, res) => {
    try {
        const userId = req.body.userId || req.userId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' });
        }

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
        res.json({ success: true, message: 'Payment Successful' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, userLogin, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentAppointment }
