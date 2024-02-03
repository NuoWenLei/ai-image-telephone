"use client"

import { Dialog } from "@headlessui/react"
import { useContext, useState } from "react"
import MenuIcon from '@mui/icons-material/Menu';
import Link from "next/link";
import { AuthContext } from "@/utilities/firebase/firebaseAuthProvider";
import { createUser } from "@/utilities/firebase/firebaseWriteFunctions";
import { toast } from "react-toastify";
import { onLogin } from "@/utilities/firebase/firebaseFunctions";

export default function Sidebar() {
	const [isOpen, setIsOpen] = useState(false);

	const authState = useContext(AuthContext);

	return (
		<>
		<div className="absolute right-2 top-2">
			<MenuIcon fontSize="large" onClick={() => setIsOpen(!isOpen)} className="cursor-pointer"/>
		</div>

		<Dialog open={isOpen} onClose={() => setIsOpen(false)}>
			<div className="fixed inset-0 bg-black/30" aria-hidden="true" />
			<Dialog.Panel className="absolute right-0 w-48 bg-black h-screen border-l-2 border-slate-200 p-4 text-slate-100">
				<div className="absolute right-2 top-2">
					<MenuIcon fontSize="large" onClick={() => setIsOpen(!isOpen)} className="cursor-pointer"/>
				</div>
				<div className="flex flex-col gap-4 pt-12">
					{(authState.user != null) ? 
						<>
							<Link href={"/daily"} className={"outline-none focus-none mx-auto" + (authState.authLoading ? "pointer-none" : "")}>Daily Game</Link>
							<Link href={"/create"} className={"outline-none focus-none mx-auto" + (authState.authLoading ? "pointer-none" : "")}>New Game</Link>
						</>
						 : 
						<>
							<button onClick={() => onLogin(authState)} disabled={authState.authLoading} className="outline-none focus-none mx-auto">Sign in</button>
						</>
					}
				</div>
			</Dialog.Panel>
		</Dialog>

		{ authState.authLoading && <div className="fixed inset-0 bg-black/30 z-50" aria-hidden="true" />}
		</>
	)
}