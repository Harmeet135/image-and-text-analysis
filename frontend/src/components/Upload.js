import React, { useState } from "react";
import axios from "axios";
import History from "./history";
import { MdContentCopy } from "react-icons/md";

const ImageUpload = () => {
  const [extractedText, setExtractedText] = useState("");
  const [file, setFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lan, setLan] = useState("eng");
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const upload = () => {
    if (!file) {
      setError("Please select an image file to upload.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("The selected file is not a valid image. Please select an image file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", lan);
  
    axios
    .post(`${process.env.REACT_APP_API_URL}/uploadimg`, formData)
      .then((response) => {
        setExtractedText(response.data.extractedText);
        setUploadSuccess(!uploadSuccess);
        setLoading(false);
        setError("");
      })
      .catch((error) => {
        setLoading(false);
        setError("An error occurred during the upload. Please try again.");
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((error) => {
        console.error("Error copying text: ", error);
      });
  };

  const handleChange = (e) => {
    setLan(e.target.value);
  };

  return (
    <>
      <div className="mx-auto p-4">
        <h1 className="text-white my-10 text-center text-4xl font-bold">
          Image to Text Translator
        </h1>
        <div className="flex lg:flex-row flex-col">
          <div className="lg:w-1/2 p-4 flex flex-col items-center">
            <div className="flex justify-between w-11/12">
              <input
                type="file"
                onChange={handleFileChange}
                className="p-2 border rounded-lg text-white"
              />
              <select
                onChange={handleChange}
                value={lan}
                className="bg-transparent text-white border-white border rounded px-2"
              >
                <option value="eng" className="bg-transparent text-black border-white">
                  English
                </option>
                <option value="hin" className="bg-transparent text-black border-white">
                  Hindi
                </option>
                <option value="tel" className="bg-transparent text-black border-white">
                  Telugu
                </option>
              </select>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="w-full h-96 bg-[#222426] border-2 border-dashed border-gray-300 p-4 flex justify-center items-center rounded-[3px] mt-6">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-80 max-w-full rounded shadow-md"
                />
              )}
            </div>
            <button
              type="button"
              onClick={upload}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
              style={
                loading ? { cursor: "not-allowed", backgroundColor: "grey" } : {}
              }
            >
              {loading ? "Extracting..." : "Extract Text"}
            </button>
          </div>
          <div className="lg:w-1/2 p-4">
            <h2 className="text-white text-center lg:mb-10 mb-4 text-xl font-bold">
              Translated Text
            </h2>
            <div className="border w-full h-96 bg-[#222426] border-gray-300 rounded-lg overflow-y-auto relative">
              <MdContentCopy
                className="text-white text-xl m-5 cursor-pointer absolute top-0 right-0"
                onClick={copyToClipboard}
              />
              {extractedText && (
                <p className="mt-10 px-8 text-white rounded-lg p-4">
                  {extractedText}
                </p>
              )}
            </div>
            {copySuccess && (
              <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
                Text copied to clipboard!
              </div>
            )}
          </div>
        </div>
      </div>
      <History uploadSuccess={uploadSuccess} />
    </>
  );
};

export default ImageUpload;
