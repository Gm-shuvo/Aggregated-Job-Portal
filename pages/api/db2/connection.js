import mongoose from 'mongoose';

const DbLinkedIn = mongoose.createConnection(process.env.DBSCRAPY_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

DbLinkedIn.on('connected', () => {
  console.log('Connected to LinkedIn DB');
});

DbLinkedIn.on('error', (err) => {
  console.log('Error connecting to LinkedIn DB', err);
});

export default DbLinkedIn;
