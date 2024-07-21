import React, { useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { X, Search, ChevronDown } from "react-feather";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crosshair2Icon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import useSearchStore from "@/store/useSearchStore";
import { useSearchParams } from "next/navigation";

const LocationDropdown = () => {
	const { dropdownOpen, setDropdownOpen, zipCode, setZipCode, dropdownQuery, setDropdownQuery, isValidZipCode, filteredLocations, handleDropdownSearchChange, handleDropdownKeyDown, handleLocationSelect, handleResetFilters, getCurrentLocation, isZipModified, loading, setLoading } = useSearchStore((state) => ({
		dropdownOpen: state.dropdownOpen,
		setDropdownOpen: state.setDropdownOpen,
		zipCode: state.zipCode,
		setZipCode: state.setZipCode,
		dropdownQuery: state.dropdownQuery,
		setDropdownQuery: state.setDropdownQuery,
		isValidZipCode: state.isValidZipCode,
		filteredLocations: state.filteredLocations,
		handleDropdownSearchChange: state.handleDropdownSearchChange,
		handleDropdownKeyDown: state.handleDropdownKeyDown,
		handleLocationSelect: state.handleLocationSelect,
		handleResetFilters: state.handleResetFilters,
		getCurrentLocation: state.getCurrentLocation,
		isZipModified: state.isZipModified,
		loading: state.loading,
		setLoading: state.setLoading,
	}));

	const searchParams = useSearchParams();
	const initialZipCode = searchParams.get("zip");

	useEffect(() => {
		if (initialZipCode) {
			setZipCode(initialZipCode);
			setDropdownQuery(initialZipCode);
		} else {
			getCurrentLocation();
		}
	}, [initialZipCode, setZipCode, setDropdownQuery, getCurrentLocation]);

	useEffect(() => {
		if (!loading && dropdownOpen) {
			setDropdownOpen(true);
		}
	}, [loading, dropdownOpen, setDropdownOpen]);

	const handleGetCurrentLocation = async () => {
		setDropdownOpen(true);
		await getCurrentLocation();
		if (zipCode) {
			setDropdownOpen(false);
		}
	};

	const handleClearZipCode = () => {
		setZipCode("");
		setDropdownQuery("");
		handleResetFilters("zip");
	};

	return (
		<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					className={`flex items-center justify-center h-8 gap-2 px-2 py-2 text-sm font-medium transition-colors ${isValidZipCode ? "bg-gray-800" : "bg-red-500"} rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3`}
					type="button"
					onClick={() => setDropdownOpen(!dropdownOpen)}
				>
					{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair2Icon className="w-4 h-4" />}
					<span className="hidden sm:block">{zipCode || "Enter zip code"}</span>
					<ChevronDown className="w-4 h-4" />
				</Button>
			</DropdownMenuTrigger>
			{isZipModified && (
				<Button size="icon" className="w-5 h-5 mt-1.5 -ml-8 mr-1" onClick={handleClearZipCode}>
					<X className="w-4 h-4" />
				</Button>
			)}
			<DropdownMenuContent className="mt-2 bg-black rounded-md w-80">
				<div className="flex items-center px-2 py-1">
					<Search className="w-4 h-4 mr-2 text-gray-400" />
					<Input placeholder="Search by zip code..." value={dropdownQuery} onChange={handleDropdownSearchChange} onKeyDown={handleDropdownKeyDown} className={`w-full h-6 p-0 text-white bg-transparent border-none placeholder:text-zinc-400 ${isValidZipCode ? "text-white" : "text-red-500 placeholder:text-red-500"}`} />
					<Button
						size="icon"
						className="flex items-center justify-center h-8 gap-2 px-2 py-2 ml-2 text-sm font-medium transition-colors bg-gray-800 rounded-md select-none shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 focus-visible:bg-gray-800 focus-visible:ring-0 hover:bg-gray-700/70 text-white/70 focus-within:bg-gray-700 hover:text-white sm:px-3"
						type="button"
						onClick={handleGetCurrentLocation}
						disabled={loading}
					>
						{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crosshair2Icon className="w-4 h-4" />}
					</Button>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{filteredLocations.length > 0 ? (
						filteredLocations.map((location) => (
							<DropdownMenuItem key={location.zip} onClick={() => handleLocationSelect(location.zip)}>
								<span>{location.name}</span>
								<span className="ml-auto text-gray-400">{location.zip}</span>
							</DropdownMenuItem>
						))
					) : (
						<DropdownMenuItem disabled>
							<span>No data found</span>
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default LocationDropdown;
