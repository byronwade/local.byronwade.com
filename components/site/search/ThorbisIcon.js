const ThorbisIcon = ({ number, isActive }) => (
	<svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer">
		<path d="M12 2C8.686 2 6 4.686 6 8C6 11.314 12 22 12 22C12 22 18 11.314 18 8C18 4.686 15.314 2 12 2Z" fill={isActive ? "#FF0000" : "#0070F3"} />
		<circle cx="12" cy="8" r="4" fill="white" />
		<text x="12" y="10" textAnchor="middle" fill="#0070F3" fontSize="6" fontWeight="bold">
			{number}
		</text>
	</svg>
);

export default ThorbisIcon;
