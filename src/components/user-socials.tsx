import Link from "next/link";
import { BiWorld } from "react-icons/bi";
import { FaFacebookSquare, FaInstagram } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";




export const UserSocials = () => {
  return (
    <div className="mt-[18px]">
        <ul>
          <li className="flex items-center justify-center gap-[16px]">
            <Link href="#">
              <BiWorld className="hover:text-blue-300"/>
            </Link>
            <Link href="#">
              <FaFacebookSquare className="hover:text-blue-300"/>
            </Link>
            <Link href="#">
              <FaInstagram className="hover:text-blue-300"/>
            </Link>
            <Link href="#">
              <FiTwitter className="hover:text-blue-300"/>
            </Link>
          </li>
        </ul>
    </div>
  )
}
