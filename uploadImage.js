import { createClient } from "@supabase/supabase-js";
import config from './config.js'
import fs from 'fs';
import path from 'path';

const supabaseUrl = config.SUPABASE_API_URL
const supabaseKey = config.SUPABASE_API_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const getBuckets = async () => {
    try {
        var { data, error } = await supabase
            .storage
            .listBuckets()
        if (data) { console.log('data', data) }
        else {
            console.log('error', error)
        }
    } catch (err) {
        throw (err)
    }
}

async function uploadLocalFile(filePath) {
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
        .from('photos')
        .upload(`images/${fileName}`, fileBuffer, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) {
        console.error('Error uploading file:', error);
    } else {
        console.log('File uploaded successfully:', data);
    }
}

// Replace with the path to your local image file
const localFilePath = './images/zuko.png';
uploadLocalFile(localFilePath);
// getBuckets()