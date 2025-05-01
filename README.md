# IBN-AI: Ibọnọ Translation Project

## About the Project

IBN-AI is a community-driven initiative to develop AI translation tools for the Ibọnọ language, preserving linguistic heritage through modern technology. The project aims to create a comprehensive English-Ibọnọ translation system by collecting translation pairs and training machine learning models.

### What is Ibọnọ?
Ibọnọ (pronounced [ee-boh-naw]) is a Nigerian language spoken by the Ibeno people, part of the Obolo ethnic group in Akwa Ibom State. It is a Lower Cross River language within the Niger-Congo family and is considered an endangered language that needs documentation and preservation efforts.

## Features

- **Translation Contribution System**
  - User-friendly form for submitting English-Ibọnọ translation pairs
  - Special character input support for Ibọnọ-specific characters (ọ, ị, n̄, ǝ)
  - Dataset management and export capabilities (JSON/CSV)

- **Translation Demo**
  - Interactive translation interface
  - Real-time translation preview
  - Supports common phrases and vocabulary

- **Educational Resources**
  - Comprehensive information about the Ibọnọ language
  - Cultural context and linguistic characteristics
  - Community engagement features

- **ML Pipeline Integration**
  1. Data Collection through user contributions
  2. Dataset Export for preprocessing
  3. Model Training using Hugging Face
  4. Model Deployment for translation

## Technologies Used

This project is built with:
- Vite - Next Generation Frontend Tooling
- TypeScript - Type-safe JavaScript
- React - UI Framework
- shadcn/ui - High-quality UI components
- Tailwind CSS - Utility-first CSS framework
- Supabase - Backend and Database

## Getting Started

### Prerequisites
- Node.js & npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

1. Clone the repository:
\`\`\`sh
git clone <YOUR_GIT_URL>
\`\`\`

2. Navigate to the project directory:
\`\`\`sh
cd <YOUR_PROJECT_NAME>
\`\`\`

3. Install dependencies:
\`\`\`sh
npm install
\`\`\`

4. Start the development server:
\`\`\`sh
npm run dev
\`\`\`

## Development Options

### Using Lovable
Visit the [Lovable Project](https://lovable.dev/projects/a7021095-b2fe-45fd-b440-940d5634c9bc) and start prompting. Changes are automatically committed.

### Using GitHub Codespaces
1. Navigate to the repository's main page
2. Click "Code" > "Codespaces" tab
3. Click "New codespace"

### Using Local IDE
Clone the repository and push changes. Changes will reflect in Lovable.

## Deployment

### Vercel Deployment (Recommended)
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Visit [Vercel](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click "Deploy"

The application will be automatically deployed and you'll receive a production URL. Vercel will automatically redeploy on every push to your main branch.

### Custom Domain Setup on Vercel
1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

### Alternative Deployment Options

Deploy through [Lovable](https://lovable.dev/projects/a7021095-b2fe-45fd-b440-940d5634c9bc) by clicking Share -> Publish.

### Custom Domain Setup
1. Navigate to Project > Settings > Domains
2. Click Connect Domain
3. Follow the [domain setup guide](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Contributing

We welcome contributions from the community! You can help by:
- Adding new English-Ibọnọ translation pairs
- Improving the ML pipeline
- Enhancing the UI/UX
- Providing cultural and linguistic expertise

## Support

If you encounter any issues or have suggestions:
- Use the feedback form in the application
- Open an issue in the repository
- Contact the development team through Lovable

## License

This project is licensed under standard open-source terms. See the LICENSE file for details.

## Acknowledgments

- The Ibeno community for their cultural and linguistic contributions
- Contributors to the translation dataset
- Lovable for development support
