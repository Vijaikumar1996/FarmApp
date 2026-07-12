import { Search } from "lucide-react";
import Button from "../ui/button/Button";

export default function SearchButton({ onClick, isLoading = false }) {
  return (
    <Button
      type="button"
      variant="outline"
      startIcon={<Search size={18} />}
      onClick={onClick}
      disabled={isLoading}
      className="w-full"
      size="sm"
    >
      {isLoading ? "Searching..." : "Search"}
    </Button>
  );
}
