# 🎵 Self-Hosted Music Streaming App

A modern, self-hosted music streaming platform built with Next.js that lets you stream your personal music collection from anywhere. Think Spotify, but for your own music files.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)

## ✨ Features

- 🎧 **Stream Your Music** - Play your personal music collection from any device
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🔍 **Smart Search** - Find songs, artists, and albums instantly
- 📁 **Auto-Library Scanning** - Automatically discovers and catalogs your music files
- 🎵 **Playlist Management** - Create and manage custom playlists
- 👥 **Multi-User Support** - Secure authentication with user-specific playlists
- 🎨 **Album Art** - Automatic cover art extraction and display
- ⚡ **Real-Time Transcoding** - Adaptive streaming with multiple quality options
- 📊 **Rich Metadata** - Extracts and displays artist, album, genre, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A collection of music files (MP3, FLAC, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/music-streaming-app.git
   cd music-streaming-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   MUSIC_LIBRARY_PATH="/path/to/your/music/folder"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Add your music**
   Place your music files in the `public/music` directory or update the `MUSIC_LIBRARY_PATH` in your `.env.local`

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
music-streaming-app/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── songs/         # Song management APIs
│   │   ├── stream/        # Audio streaming endpoints
│   │   ├── playlists/     # Playlist APIs
│   │   └── auth/          # Authentication
│   ├── components/        # React components
│   │   ├── AudioPlayer.tsx
│   │   ├── SongList.tsx
│   │   └── SearchBar.tsx
│   ├── lib/               # Utility functions
│   └── globals.css        # Global styles
├── prisma/                # Database schema
│   └── schema.prisma
├── public/
│   └── music/            # Your music files (default location)
└── README.md
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Audio Processing**: music-metadata, FFmpeg
- **Deployment**: Docker, Vercel, or self-hosted

## 📱 API Endpoints

### Songs
- `GET /api/songs` - Get all songs
- `POST /api/songs/scan` - Scan music directory
- `GET /api/stream/[id]` - Stream audio file

### Playlists
- `GET /api/playlists` - Get user playlists
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/[id]` - Update playlist
- `DELETE /api/playlists/[id]` - Delete playlist

### Search
- `GET /api/search?q=query` - Search songs, artists, albums

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Required |
| `NEXTAUTH_URL` | Base URL of your app | `http://localhost:3000` |
| `MUSIC_LIBRARY_PATH` | Path to music files | `./public/music` |

### Supported Audio Formats

- MP3
- FLAC
- AAC
- OGG
- WAV
- M4A

## 🐳 Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t music-streaming-app .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -v /path/to/your/music:/app/public/music \
     -e DATABASE_URL="your-database-url" \
     -e NEXTAUTH_SECRET="your-secret" \
     music-streaming-app
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced audio visualizations
- [ ] Social features (sharing playlists)
- [ ] Last.fm integration
- [ ] Lyrics support
- [ ] Smart playlists based on listening history
- [ ] Offline sync for mobile
- [ ] Multi-server synchronization

## 🐛 Known Issues

- Large music libraries (>10,000 songs) may have slower initial scan times
- Safari on iOS has limited audio format support
- Some metadata extraction may be incomplete for certain file formats

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the awesome framework
- [Prisma](https://prisma.io/) for database management
- [music-metadata](https://github.com/borewit/music-metadata) for audio metadata extraction
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you have any questions or run into issues, please [open an issue](https://github.com/yourusername/music-streaming-app/issues) on GitHub.

---

**Made with ❤️ for music lovers who want to own their streaming experience**
