import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchUserFiles();
  }, []);

  
  const fetchUserFiles = async () => {
    try {
      const response = await fetch(
        "https://braillebridgebackend-9zof.onrender.com/api/files",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  
  const handleDownload = async (url, filename = "file") => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;

      const ext = url.split(".").pop().split("?")[0];
      link.download = `${filename}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download the file.");
    }
  };

  
  const handleView = (url) => {
    if (!url) return alert("File not available for preview.");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  
  const handleViewOriginal = (url) => {
    if (!url) return alert("Original file not available.");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  
 const handleDeleteFile = async (fileId) => {
  if (!window.confirm("Are you sure you want to delete this file?")) return;

  try {
    const response = await fetch(
      `https://braillebridgebackend-9zof.onrender.com/api/files/${fileId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Delete failed:", data);
      throw new Error(data.message || "Failed to delete file");
    }

    
    alert("File deleted successfully!");
    setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
  } catch (error) {
    console.error("Error deleting file:", error);
    alert("Failed to delete file: " + error.message);
  }
};


  const styles = {
    container: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #1e293b 0%, #581c87 50%, #1e293b 100%)",
      color: "#fff",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      padding: window.innerWidth <= 768 ? "1.5rem 1rem" : "3rem 2rem",
    },
    content: { marginTop: "80px", maxWidth: "1200px", margin: "0 auto" },
    welcomeTitle: {
      fontSize: window.innerWidth <= 768 ? "1.75rem" : "2.5rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
    },
    welcomeSubtitle: { color: "#d1d5db", fontSize: "1.1rem" },
    statCard: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      padding: "1.5rem",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    statValue: {
      fontSize: "2rem",
      fontWeight: "bold",
      background: "linear-gradient(135deg, #c084fc 0%, #f9a8d4 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      marginBottom: "0.25rem",
    },
    section: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: "16px",
      padding: "2rem",
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
    clickableFile: {
      color: "#93c5fd",
      textDecoration: "underline",
      cursor: "pointer",
    },
    iconButton: {
      background: "none",
      border: "none",
      color: "#d1d5db",
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "6px",
      fontSize: "1.1rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.welcomeTitle}>
          Welcome back, {user.name.split(" ")[0]}! 👋
        </h1>
        <p style={styles.welcomeSubtitle}>
          Here’s what’s happening with your account today.
        </p>

        <div style={styles.statCard}>
          <div style={styles.statValue}>{files.length}</div>
          <div>Total Files</div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <div style={styles.section}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              Your Uploaded Files
            </h2>

            {loading ? (
              <p>Loading files...</p>
            ) : files.length === 0 ? (
              <p>No files uploaded yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "1rem" }}>
                        File Name
                      </th>
                      <th style={{ textAlign: "left", padding: "1rem" }}>
                        Date
                      </th>
                      <th style={{ textAlign: "left", padding: "1rem" }}>
                        Converted Files
                      </th>
                      <th style={{ textAlign: "left", padding: "1rem" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file._id}>
                        <td
                          style={{ ...styles.clickableFile, padding: "1rem" }}
                          onClick={() => handleViewOriginal(file.cloudinary_url)}
                        >
                          {file.filename}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          {new Date(file.createdAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          {file.convertedType === "braille" ? (
                            <>
                              <div>
                                <strong>.brf</strong>{" "}
                                <button
                                  style={styles.iconButton}
                                  onClick={() =>
                                    handleDownload(
                                      file.converted_url,
                                      file.filename
                                    )
                                  }
                                  title="Download Braille"
                                >
                                  ⬇️
                                </button>
                              </div>
                              {file.braille_unicode_url && (
                                <div>
                                  <strong>.txt</strong>{" "}
                                  
                                  <button
                                    style={styles.iconButton}
                                    onClick={() =>
                                      handleDownload(
                                        file.braille_unicode_url,
                                        file.filename
                                      )
                                    }
                                    title="Download Unicode"
                                  >
                                    ⬇️
                                  </button>
                                </div>
                              )}
                            </>
                          ) : file.convertedType === "tts" ? (
                            <div>
                              <button
                                style={styles.iconButton}
                                onClick={() => handleView(file.converted_url)}
                                title="Play Audio"
                              >
                                🔊
                              </button>
                              <button
                                style={styles.iconButton}
                                onClick={() =>
                                  handleDownload(file.converted_url, file.filename)
                                }
                                title="Download Audio"
                              >
                                ⬇️
                              </button>
                            </div>
                          ) : (
                            <span style={{ color: "#9ca3af" }}>Not converted</span>
                          )}
                        </td>
                        <td style={{ padding: "1rem" }}>
                          <button
                            style={styles.iconButton}
                            onClick={() => handleDeleteFile(file._id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}