using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using Google.Cloud.Speech.V1;
using Google.Cloud.TextToSpeech.V1;

namespace SpeechToText
{
    public class SpeechConverter
    {
        public string ConvertSpeechToText(byte[] bytes)
        {
            System.Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "Speech-206301277cf5.json");
            var speech = SpeechClient.Create();
            var response = speech.Recognize(new RecognitionConfig()
            {
                Encoding = RecognitionConfig.Types.AudioEncoding.Linear16,
                LanguageCode = "en",
            }, RecognitionAudio.FromBytes(bytes));
            string text = "";
            foreach (var result in response.Results)
            {
                foreach (var alternative in result.Alternatives)
                {
                    text += alternative.Transcript;
                }
            }
            return text;
        }

        public byte[] ConvertTextToSpeech(string text)
        {
            // Instantiate a client
            TextToSpeechClient client = TextToSpeechClient.Create();

            // Set the text input to be synthesized.
            SynthesisInput input = new SynthesisInput
            {
                Text = text
            };

            // Build the voice request, select the language code ("en-US"),
            // and the SSML voice gender ("neutral").
            VoiceSelectionParams voice = new VoiceSelectionParams
            {
                LanguageCode = "en-US",
                SsmlGender = SsmlVoiceGender.Neutral
            };

            // Select the type of audio file you want returned.
            AudioConfig config = new AudioConfig
            {
                AudioEncoding = AudioEncoding.Linear16
            };

            // Perform the Text-to-Speech request, passing the text input
            // with the selected voice parameters and audio file type
            var response = client.SynthesizeSpeech(new SynthesizeSpeechRequest
            {
                Input = input,
                Voice = voice,
                AudioConfig = config
            });

            // Write the binary AudioContent of the response to an MP3 file.
            using (Stream output = File.Create("sample.wav"))
            {
                response.AudioContent.WriteTo(output);
                Console.WriteLine($"Audio content written to file 'sample.mp3'");
            }

            return File.ReadAllBytes("sample.wav");

        }
    }
}
