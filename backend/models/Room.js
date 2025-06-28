const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    capacity: {
        adults: { type: Number, default: 2 },
        children: { type: Number, default: 2 }
    },
    amenities: [{
        type: String
    }],
    images: [{
        url: { type: String, required: true },
        alt: { type: String, required: true },
        caption: { type: String }
    }],
    features: [{
        type: String
    }],
    size: {
        type: String
    },
    bedType: {
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    seoTitle: {
        type: String
    },
    seoDescription: {
        type: String
    },
    seoKeywords: [{
        type: String
    }],
    metaData: {
        viewCount: { type: Number, default: 0 },
        bookingCount: { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full price display
roomSchema.virtual('priceDisplay').get(function () {
    return `₹${this.price}`;
});

// Index for better search performance
roomSchema.index({ name: 'text', description: 'text', 'amenities': 'text' });
roomSchema.index({ slug: 1 });
roomSchema.index({ isAvailable: 1, isFeatured: 1 });

module.exports = mongoose.model('Room', roomSchema); 