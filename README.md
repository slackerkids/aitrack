# <p align="center" height="40px" width="40px"> HealHunter an AI-backed telehealth SaaS for preliminary diagnosis </p>

## ✅ Features

- **AI-Driven Telehealth**: Leverage AI to provide preliminary diagnoses, improving the efficiency and accuracy of healthcare services;
- **AI Disease Identifier**: Allowing patients to input symptoms and predict diagnoses with fine-tuned Gemini 1.5;
- **AI Healthcare Chatbot**: Asks clarifying questions for faster diagnoses and better doctor understanding;
- **AI Audio-to-Text Transcription**: Recording patient-doctor conversations using OpenAI's Whisper and GPT-4 technology.
- **User-Friendly UI/UX**: Intuitive interfaces for both clients and doctors to ensure seamless interactions.
- **Integrated Video Calls**: Utilize Google Meet for video consultations directly within the application.
- **Skin Disease Detection**: Implement AI models to identify various skin conditions.
- **Deployment**: Deployed on Vercel for easy access and scalability.

## 📂 Repository Structure

### Next.js Project

- **app/**: Contains Axios instance, Doctor's and Client's Dashboards, layout page.
- **components/**: Contains React components used in the project.
- **pages/**: Contains Next.js pages. Each file in this directory is associated with a route based on its file name.
- **styles/**: Contains CSS files for styling the application.
- **public/**: Contains static files such as images, which can be accessed directly.
- **utils/**: Contains utility functions and helpers used throughout the project.

### AI Folder

- **preprocessing.py**: Loads the entire dataset, performs image preprocessing, and splits the images into train, validation, and test sets.
- **sets_visualization.py**: Visualizes the distribution of different skin lesion types across train, validation, and test sets.
- **augmentation.py**: Augments images in the dataset for classes with insufficient data.
- **model.py**: Builds the Xception model for skin lesion diagnosis.
- **evaluate.py**: Evaluates the model, providing confusion matrix, accuracy and loss histograms, and classification report.
- **predict.py**: Predicts a batch of images from a directory using the trained model.

## 📝 ToDo List

- [x] UI/UX (client, doctor)
- [x] Landing + onboarding
- [x] Fix GEMINI 1.5, OpenAI WHISPER
- [x] Restructure APP.PY
- [x] Google Meet for video calls in Calendar 
- [x] Skin Disease AI implementation
- [x] Deployment on Vercel

## Links

- [Backend Repository](https://github.com/Bebdyshev/aitrack-back)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js
- Python 3.x
- Virtual environment tool (e.g., `venv` or `virtualenv`)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/azekowka/aitrack.git
   ```
2. Install Node.js dependencies
   ```sh
   npm install
   ```
3. Run the Next.js application
   ```sh
   npm run dev
   ```
4. Access the Next.js application at `http://localhost:3000`
5. Create a virtual environment
   ```sh
   python -m venv venv
   ```
6. Activate the virtual environment

   - On Windows
     ```sh
     venv\Scripts\activate
     ```
   - On macOS/Linux
     ```sh
     source venv/bin/activate
     ```
7. Install Python dependencies
   ```sh
   pip install -r requirements.txt
   ```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Abdulaziz Gabitov - gabjtov@gmail.com
Kerey Berdyshev - berdyshev.k1004@gmail.com

Project Link: [https://github.com/azekowka/aitrack](https://github.com/azekowka/aitrack)