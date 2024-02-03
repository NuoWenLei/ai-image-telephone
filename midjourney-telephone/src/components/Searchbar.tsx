"use client";

import SearchIcon from '@mui/icons-material/Search';

export default function Searchbar() {
	return (
		<div className="w-4/5 rounded-full h-10 flex flex-row bg-white text-black overflow-hidden">
			<div className="h-full w-10 flex flex-col justify-center">
				<SearchIcon className="mx-auto"/>
			</div>
			<input className="w-full outline-none bg-transparent" type="text" placeholder="Search game..."/>
			<div className="w-20 bg-slate-700 text-white flex flex-col text-center justify-center">
				Search
			</div>
		</div>
	)
}