const express = require("express");
const route = express.Router();
const UrlModel = require('../model/urls');
// const { nanoid } = require('nanoid');

// Create short URL
route.post("/shorturl", async (req, res) => {
    try {
        const { url, shortcode, validity } = req.body;

        if (!url || !validity) {
            return res.status(400).json({ success: false, message: "url and validity are required" });
        }

        // Calculate expiry
        const expiry = new Date(Date.now() + validity * 60 * 1000);

        const newurl = new UrlModel({
            url,
            shortcode,
            validity,
            expiry
        });

        const added = await newurl.save();

        res.status(201).json({
            success: true,
            message: "Short URL created successfully",
            shortLink: `${req.protocol}://${req.get('host')}/shorturls/${added.shortcode}`,
            expiry: added.expiry
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

// Redirect to original URL using shortcode
route.get('/shorturl/:shortcode', async (req, res) => {
    try {
        const { shortcode } = req.params;
        const urlDoc = await UrlModel.findOne({ shortcode });

        if (!urlDoc) {
            return res.status(404).json({ success: false, message: "Short URL not found" });
        }

        // Check if the link is expired
        if (new Date() > urlDoc.expiry) {
            return res.status(410).json({ success: false, message: "Short URL has expired" });
        }

        // Optionally increment click count
        urlDoc.clicks = (urlDoc.clicks || 0) + 1;
        await urlDoc.save();

        // Redirect to the original URL
        res.redirect(urlDoc.url);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
module.exports = route;