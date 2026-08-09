const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  paidOn: { type: Date, default: Date.now },
  mode: { type: String, enum: ['Online', 'Cash', 'DD', 'Challan'], default: 'Online' },
  transactionId: { type: String, default: '' },
  receiptNo: { type: String, default: '' },
});

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true },
    academicYear: { type: String, required: true }, // e.g. "2024-25"
    totalFee: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    feeBreakdown: {
      tuitionFee: { type: Number, default: 0 },
      examFee: { type: Number, default: 0 },
      libraryFee: { type: Number, default: 0 },
      developmentFee: { type: Number, default: 0 },
      otherFee: { type: Number, default: 0 },
    },
    payments: [paymentSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

feeSchema.virtual('paidAmount').get(function () {
  return this.payments.reduce((sum, p) => sum + p.amount, 0);
});

feeSchema.virtual('dueAmount').get(function () {
  const paid = this.payments.reduce((sum, p) => sum + p.amount, 0);
  return this.totalFee - paid;
});

feeSchema.virtual('status').get(function () {
  const paid = this.payments.reduce((sum, p) => sum + p.amount, 0);
  if (paid >= this.totalFee) return 'Paid';
  if (paid > 0) return 'Partial';
  return 'Due';
});

module.exports = mongoose.model('Fee', feeSchema);
