const ItemCard = ({ item }) => {
  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h3>{item.title || "No title yet"}</h3>

      {item.thumbnail && (
        <img src={item.thumbnail} width="200" />
      )}

      {/* STATUS */}
      {item.status === "processing" && <p>⏳ Processing...</p>}
      {item.status === "failed" && <p>❌ Failed</p>}

      {/* TAGS */}
      {item.tags?.length > 0 && (
        <div>
          {item.tags.map((tag, i) => (
            <span key={i} style={{ marginRight: "5px" }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemCard;