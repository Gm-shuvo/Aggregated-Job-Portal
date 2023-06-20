import mongoose from 'mongoose';

const connectDBJobPortal = mongoose.createConnection(process.env.DBJOBPORTAL_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
connectDBJobPortal.on('connected', () => {
  console.log('Connected to Job Portal DB');
});

connectDBJobPortal.on('error', (err) => {
  console.log('Error connecting to Job Portal DB', err);

});

export default connectDBJobPortal;
