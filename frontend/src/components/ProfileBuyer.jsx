"use client";

import React, { useState } from "react";
import { FaLocationArrow, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { FaUpload } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import Link from "next/link";
import Filebase from "react-file-base64";
import { updateUserById } from "@/utils/api";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { update } from "@/redux/slices/authSlice";

function calculateProfileCompleteness(profile) {
    const { details, gig } = profile;

    let completeness = 0;

    if (details) {
        if (details.aboutMe) {
            completeness += 25;
        }
        if (details.image) {
            completeness += 25;
        }
        if (details.country) {
            completeness += 25;
        }
    }

    if (gig && gig.length > 0) {
        completeness += 25;
    }

    return completeness;
}

export default function Profile() {
    const { user } = useSelector((state) => state.authReducer);
    const gigs = useSelector((state) => state.gigReducer).gigs.filter(gig => gig.userId == user?._id);
    const [editState, setEditState] = useState(false);
    const dispatch = useDispatch();

    const [updatedDetails, setUpdatedDetails] = useState(user?.details);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUserById({ ...user, details: updatedDetails });
        dispatch(update({ ...user, details: updatedDetails }));
        toast.success("details updated!");
        setEditState(false);
    };

    return (
        <div class="bg-gray-100">
            <ToastContainer />
            <div class=" ">
                <div class="grid grid-cols-4 sm:grid-cols-12 gap-6">
                    <div className="col-span-4 sm:col-span-4">
                        <div className="bg-white shadow h-screen p-6">
                            <div className="flex flex-col items-center">
                                <label
                                    htmlFor="upload-image"
                                    className="relative cursor-pointer"
                                >
                                    {user && user?.details?.image ? (
                                        <img
                                            src={user?.details?.image}
                                            alt="Profile"
                                            className="w-32 h-32 bg-gray-300 rounded-full mb-4"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
                                            <FaUpload className="text-gray-400 w-16 h-16" />
                                        </div>
                                    )}
                                    {editState && (
                                        <div className="flex flex-col items-center">
                                            <Filebase
                                                type="file"
                                                multiple={false}
                                                onDone={({ base64 }) => {
                                                    setUpdatedDetails({
                                                        ...updatedDetails,
                                                        image: base64,
                                                    });
                                                }}
                                            />
                                        </div>
                                    )}
                                </label>

                                {
                                    <p className="text-xl font-bold text-center mb-3">
                                        {user?.name}
                                    </p>
                                }
                            </div>

                            <span className="mb-3 pb-4 text-center">
                                {" "}
                                Profile Completeness
                            </span>

                            <div class="w-full mt-3 bg-gray-200 rounded-full dark:bg-gray-700">
                                <div
                                    class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                                    style={{ width: `${calculateProfileCompleteness(user)}%` }}
                                >
                                    {" "}
                                    {calculateProfileCompleteness(user)}%
                                </div>
                            </div>

                            <hr className="my-6 border-t border-gray-300" />
                            <div className="flex flex-col">
                                <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">
                                    Country
                                </span>
                                <ul>
                                    <li className="text-black font-semibold flex items-center py-1">
                                        {!editState ? (
                                            <p>{user?.details?.country}</p>
                                        ) : (
                                            <select
                                                className="mr-1 p-1"
                                                onChange={(e) =>
                                                    setUpdatedDetails({
                                                        ...updatedDetails,
                                                        country: e.target.value,
                                                    })
                                                }
                                            >
                                                <option
                                                    value=""
                                                    disabled
                                                    selected
                                                    hidden
                                                >
                                                    Select a Country
                                                </option>
                                                <option value="AF">
                                                    Afghanistan
                                                </option>
                                                <option value="AL">
                                                    Albania
                                                </option>
                                                <option value="DZ">
                                                    Algeria
                                                </option>
                                                <option value="AS">
                                                    American Samoa
                                                </option>
                                                <option value="AD">
                                                    Andorra
                                                </option>
                                                <option value="AO">
                                                    Angola
                                                </option>
                                                <option value="AI">
                                                    Anguilla
                                                </option>
                                                <option value="AG">
                                                    Antigua and Barbuda
                                                </option>
                                                <option value="AR">
                                                    Argentina
                                                </option>
                                                <option value="AM">
                                                    Armenia
                                                </option>
                                                <option value="AW">
                                                    Aruba
                                                </option>
                                                <option value="AU">
                                                    Australia
                                                </option>
                                                <option value="AT">
                                                    Austria
                                                </option>
                                                <option value="AZ">
                                                    Azerbaijan
                                                </option>
                                                <option value="BS">
                                                    Bahamas
                                                </option>
                                                <option value="BH">
                                                    Bahrain
                                                </option>
                                                <option value="BD">
                                                    Bangladesh
                                                </option>
                                                <option value="BB">
                                                    Barbados
                                                </option>
                                                <option value="BY">
                                                    Belarus
                                                </option>
                                                <option value="BE">
                                                    Belgium
                                                </option>
                                                <option value="BZ">
                                                    Belize
                                                </option>
                                                <option value="BJ">
                                                    Benin
                                                </option>
                                                <option value="BM">
                                                    Bermuda
                                                </option>
                                                <option value="BT">
                                                    Bhutan
                                                </option>
                                                <option value="BO">
                                                    Bolivia
                                                </option>
                                                <option value="BA">
                                                    Bosnia and Herzegovina
                                                </option>
                                                <option value="BW">
                                                    Botswana
                                                </option>
                                                <option value="BR">
                                                    Brazil
                                                </option>
                                                <option value="VG">
                                                    British Virgin Islands
                                                </option>
                                                <option value="BN">
                                                    Brunei
                                                </option>
                                                <option value="BG">
                                                    Bulgaria
                                                </option>
                                                <option value="BF">
                                                    Burkina Faso
                                                </option>
                                                <option value="BI">
                                                    Burundi
                                                </option>
                                                <option value="KH">
                                                    Cambodia
                                                </option>
                                                <option value="CM">
                                                    Cameroon
                                                </option>
                                                <option value="CA">
                                                    Canada
                                                </option>
                                                <option value="CV">
                                                    Cape Verde
                                                </option>
                                                <option value="KY">
                                                    Cayman Islands
                                                </option>
                                                <option value="CF">
                                                    Central African Republic
                                                </option>
                                                <option value="TD">Chad</option>
                                                <option value="CL">
                                                    Chile
                                                </option>
                                                <option value="CN">
                                                    China
                                                </option>
                                                <option value="CO">
                                                    Colombia
                                                </option>
                                                <option value="KM">
                                                    Comoros
                                                </option>
                                                <option value="CK">
                                                    Cook Islands
                                                </option>
                                                <option value="CR">
                                                    Costa Rica
                                                </option>
                                                <option value="HR">
                                                    Croatia
                                                </option>
                                                <option value="CU">Cuba</option>
                                                <option value="CW">
                                                    Curacao
                                                </option>
                                                <option value="CY">
                                                    Cyprus
                                                </option>
                                                <option value="CZ">
                                                    Czech Republic
                                                </option>
                                                <option value="CD">
                                                    Democratic Republic of the
                                                    Congo
                                                </option>
                                                <option value="DK">
                                                    Denmark
                                                </option>
                                                <option value="DJ">
                                                    Djibouti
                                                </option>
                                                <option value="DM">
                                                    Dominica
                                                </option>
                                                <option value="DO">
                                                    Dominican Republic
                                                </option>
                                                <option value="TL">
                                                    East Timor
                                                </option>
                                                <option value="EC">
                                                    Ecuador
                                                </option>
                                                <option value="EG">
                                                    Egypt
                                                </option>
                                                <option value="SV">
                                                    El Salvador
                                                </option>
                                                <option value="GQ">
                                                    Equatorial Guinea
                                                </option>
                                                <option value="ER">
                                                    Eritrea
                                                </option>
                                                <option value="EE">
                                                    Estonia
                                                </option>
                                                <option value="ET">
                                                    Ethiopia
                                                </option>
                                                <option value="FK">
                                                    Falkland Islands
                                                </option>
                                                <option value="FO">
                                                    Faroe Islands
                                                </option>
                                                <option value="FJ">Fiji</option>
                                                <option value="FI">
                                                    Finland
                                                </option>
                                                <option value="FR">
                                                    France
                                                </option>
                                                <option value="GF">
                                                    French Guiana
                                                </option>
                                                <option value="PF">
                                                    French Polynesia
                                                </option>
                                                <option value="GA">
                                                    Gabon
                                                </option>
                                                <option value="GM">
                                                    Gambia
                                                </option>
                                                <option value="GE">
                                                    Georgia
                                                </option>
                                                <option value="DE">
                                                    Germany
                                                </option>
                                                <option value="GH">
                                                    Ghana
                                                </option>
                                                <option value="GI">
                                                    Gibraltar
                                                </option>
                                                <option value="GR">
                                                    Greece
                                                </option>
                                                <option value="GL">
                                                    Greenland
                                                </option>
                                                <option value="GD">
                                                    Grenada
                                                </option>
                                                <option value="GP">
                                                    Guadeloupe
                                                </option>
                                                <option value="GU">Guam</option>
                                                <option value="GT">
                                                    Guatemala
                                                </option>
                                                <option value="GN">
                                                    Guinea
                                                </option>
                                                <option value="GW">
                                                    Guinea-Bissau
                                                </option>
                                                <option value="GY">
                                                    Guyana
                                                </option>
                                                <option value="HT">
                                                    Haiti
                                                </option>
                                                <option value="HN">
                                                    Honduras
                                                </option>
                                                <option value="HK">
                                                    Hong Kong
                                                </option>
                                                <option value="HU">
                                                    Hungary
                                                </option>
                                                <option value="IS">
                                                    Iceland
                                                </option>
                                                <option value="IN">
                                                    India
                                                </option>
                                                <option value="ID">
                                                    Indonesia
                                                </option>
                                                <option value="IR">Iran</option>
                                                <option value="IQ">Iraq</option>
                                                <option value="IE">
                                                    Ireland
                                                </option>
                                                <option value="IL">
                                                    Israel
                                                </option>
                                                <option value="IT">
                                                    Italy
                                                </option>
                                                <option value="CI">
                                                    Ivory Coast
                                                </option>
                                                <option value="JM">
                                                    Jamaica
                                                </option>
                                                <option value="JP">
                                                    Japan
                                                </option>
                                                <option value="JO">
                                                    Jordan
                                                </option>
                                                <option value="KZ">
                                                    Kazakhstan
                                                </option>
                                                <option value="KE">
                                                    Kenya
                                                </option>
                                                <option value="KI">
                                                    Kiribati
                                                </option>
                                                <option value="XK">
                                                    Kosovo
                                                </option>
                                                <option value="KW">
                                                    Kuwait
                                                </option>
                                                <option value="KG">
                                                    Kyrgyzstan
                                                </option>
                                                <option value="LA">Laos</option>
                                                <option value="LV">
                                                    Latvia
                                                </option>
                                                <option value="LB">
                                                    Lebanon
                                                </option>
                                                <option value="LS">
                                                    Lesotho
                                                </option>
                                                <option value="LR">
                                                    Liberia
                                                </option>
                                                <option value="LY">
                                                    Libya
                                                </option>
                                                <option value="LI">
                                                    Liechtenstein
                                                </option>
                                                <option value="LT">
                                                    Lithuania
                                                </option>
                                                <option value="LU">
                                                    Luxembourg
                                                </option>
                                                <option value="MO">
                                                    Macau
                                                </option>
                                                <option value="MK">
                                                    Macedonia
                                                </option>
                                                <option value="MG">
                                                    Madagascar
                                                </option>
                                                <option value="MW">
                                                    Malawi
                                                </option>
                                                <option value="MY">
                                                    Malaysia
                                                </option>
                                                <option value="MV">
                                                    Maldives
                                                </option>
                                                <option value="ML">Mali</option>
                                                <option value="MT">
                                                    Malta
                                                </option>
                                                <option value="MH">
                                                    Marshall Islands
                                                </option>
                                                <option value="MQ">
                                                    Martinique
                                                </option>
                                                <option value="MR">
                                                    Mauritania
                                                </option>
                                                <option value="MU">
                                                    Mauritius
                                                </option>
                                                <option value="YT">
                                                    Mayotte
                                                </option>
                                                <option value="MX">
                                                    Mexico
                                                </option>
                                                <option value="FM">
                                                    Micronesia
                                                </option>
                                                <option value="MD">
                                                    Moldova
                                                </option>
                                                <option value="MC">
                                                    Monaco
                                                </option>
                                                <option value="MN">
                                                    Mongolia
                                                </option>
                                                <option value="ME">
                                                    Montenegro
                                                </option>
                                                <option value="MS">
                                                    Montserrat
                                                </option>
                                                <option value="MA">
                                                    Morocco
                                                </option>
                                                <option value="MZ">
                                                    Mozambique
                                                </option>
                                                <option value="MM">
                                                    Myanmar
                                                </option>
                                                <option value="NA">
                                                    Namibia
                                                </option>
                                                <option value="NR">
                                                    Nauru
                                                </option>
                                                <option value="NP">
                                                    Nepal
                                                </option>
                                                <option value="NL">
                                                    Netherlands
                                                </option>
                                                <option value="AN">
                                                    Netherlands Antilles
                                                </option>
                                                <option value="NC">
                                                    New Caledonia
                                                </option>
                                                <option value="NZ">
                                                    New Zealand
                                                </option>
                                                <option value="NI">
                                                    Nicaragua
                                                </option>
                                                <option value="NE">
                                                    Niger
                                                </option>
                                                <option value="NG">
                                                    Nigeria
                                                </option>
                                                <option value="NU">Niue</option>
                                                <option value="NF">
                                                    Norfolk Island
                                                </option>
                                                <option value="KP">
                                                    North Korea
                                                </option>
                                                <option value="MP">
                                                    Northern Mariana Islands
                                                </option>
                                                <option value="NO">
                                                    Norway
                                                </option>
                                                <option value="OM">Oman</option>
                                                <option value="PK">
                                                    Pakistan
                                                </option>
                                                <option value="PW">
                                                    Palau
                                                </option>
                                                <option value="PS">
                                                    Palestinian Territory
                                                </option>
                                                <option value="PA">
                                                    Panama
                                                </option>
                                                <option value="PG">
                                                    Papua New Guinea
                                                </option>
                                                <option value="PY">
                                                    Paraguay
                                                </option>
                                                <option value="PE">Peru</option>
                                                <option value="PH">
                                                    Philippines
                                                </option>
                                                <option value="PN">
                                                    Pitcairn
                                                </option>
                                                <option value="PL">
                                                    Poland
                                                </option>
                                                <option value="PT">
                                                    Portugal
                                                </option>
                                                <option value="PR">
                                                    Puerto Rico
                                                </option>
                                                <option value="QA">
                                                    Qatar
                                                </option>
                                                <option value="CG">
                                                    Republic of the Congo
                                                </option>
                                                <option value="RE">
                                                    Reunion
                                                </option>
                                                <option value="RO">
                                                    Romania
                                                </option>
                                                <option value="RU">
                                                    Russia
                                                </option>
                                                <option value="RW">
                                                    Rwanda
                                                </option>
                                                <option value="BL">
                                                    Saint Barthelemy
                                                </option>
                                                <option value="SH">
                                                    Saint Helena
                                                </option>
                                                <option value="KN">
                                                    Saint Kitts and Nevis
                                                </option>
                                                <option value="LC">
                                                    Saint Lucia
                                                </option>
                                                <option value="MF">
                                                    Saint Martin
                                                </option>
                                                <option value="PM">
                                                    Saint Pierre and Miquelon
                                                </option>
                                                <option value="VC">
                                                    Saint Vincent and the
                                                    Grenadines
                                                </option>
                                                <option value="WS">
                                                    Samoa
                                                </option>
                                                <option value="SM">
                                                    San Marino
                                                </option>
                                                <option value="ST">
                                                    Sao Tome and Principe
                                                </option>
                                                <option value="SA">
                                                    Saudi Arabia
                                                </option>
                                                <option value="SN">
                                                    Senegal
                                                </option>
                                                <option value="RS">
                                                    Serbia
                                                </option>
                                                <option value="SC">
                                                    Seychelles
                                                </option>
                                                <option value="SL">
                                                    Sierra Leone
                                                </option>
                                                <option value="SG">
                                                    Singapore
                                                </option>
                                                <option value="SK">
                                                    Slovakia
                                                </option>
                                                <option value="SI">
                                                    Slovenia
                                                </option>
                                                <option value="SB">
                                                    Solomon Islands
                                                </option>
                                                <option value="SO">
                                                    Somalia
                                                </option>
                                                <option value="ZA">
                                                    South Africa
                                                </option>
                                                <option value="KR">
                                                    South Korea
                                                </option>
                                                <option value="SS">
                                                    South Sudan
                                                </option>
                                                <option value="ES">
                                                    Spain
                                                </option>
                                                <option value="LK">
                                                    Sri Lanka
                                                </option>
                                                <option value="SD">
                                                    Sudan
                                                </option>
                                                <option value="SR">
                                                    Suriname
                                                </option>
                                                <option value="SJ">
                                                    Svalbard and Jan Mayen
                                                </option>
                                                <option value="SZ">
                                                    Swaziland
                                                </option>
                                                <option value="SE">
                                                    Sweden
                                                </option>
                                                <option value="CH">
                                                    Switzerland
                                                </option>
                                                <option value="SY">
                                                    Syria
                                                </option>
                                                <option value="TW">
                                                    Taiwan
                                                </option>
                                                <option value="TJ">
                                                    Tajikistan
                                                </option>
                                                <option value="TZ">
                                                    Tanzania
                                                </option>
                                                <option value="TH">
                                                    Thailand
                                                </option>
                                                <option value="TG">Togo</option>
                                                <option value="TK">
                                                    Tokelau
                                                </option>
                                                <option value="TO">
                                                    Tonga
                                                </option>
                                                <option value="TT">
                                                    Trinidad and Tobago
                                                </option>
                                                <option value="TN">
                                                    Tunisia
                                                </option>
                                                <option value="TR">
                                                    Turkey
                                                </option>
                                                <option value="TM">
                                                    Turkmenistan
                                                </option>
                                                <option value="TC">
                                                    Turks and Caicos Islands
                                                </option>
                                                <option value="TV">
                                                    Tuvalu
                                                </option>
                                                <option value="VI">
                                                    U.S. Virgin Islands
                                                </option>
                                                <option value="UG">
                                                    Uganda
                                                </option>
                                                <option value="UA">
                                                    Ukraine
                                                </option>
                                                <option value="AE">
                                                    United Arab Emirates
                                                </option>
                                                <option value="GB">
                                                    United Kingdom
                                                </option>
                                                <option value="US">
                                                    United States
                                                </option>
                                                <option value="UY">
                                                    Uruguay
                                                </option>
                                                <option value="UZ">
                                                    Uzbekistan
                                                </option>
                                                <option value="VU">
                                                    Vanuatu
                                                </option>
                                                <option value="VA">
                                                    Vatican
                                                </option>
                                                <option value="VE">
                                                    Venezuela
                                                </option>
                                                <option value="VN">
                                                    Vietnam
                                                </option>
                                                <option value="WF">
                                                    Wallis and Futuna
                                                </option>
                                                <option value="EH">
                                                    Western Sahara
                                                </option>
                                                <option value="YE">
                                                    Yemen
                                                </option>
                                                <option value="ZM">
                                                    Zambia
                                                </option>
                                                <option value="ZW">
                                                    Zimbabwe
                                                </option>
                                            </select>
                                        )}
                                    </li>
                                </ul>
                                <div
                                    className="mt-5"
                                    style={{ display: "flex" }}
                                >
                                    {editState && (
                                        <button
                                            type="submit"
                                            className="inline-block rounded-lg bg-blue-500 p-2 text-sm font-medium text-white mr-2"
                                            style={{ flex: "1" }}
                                            onClick={handleSubmit}
                                        >
                                            Save
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="inline-block rounded-lg bg-gray-500 p-2 text-sm font-medium text-white"
                                        style={{ flex: "1" }}
                                        onClick={() =>
                                            editState
                                                ? setEditState(false)
                                                : setEditState(true)
                                        }
                                    >
                                        {editState ? "Cancel" : "Edit Profile"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-4 sm:col-span-8">
                        <h2 class="text-2xl font-bold my-4">About Me</h2>
                        {!editState ? (
                            <div>{user?.details?.aboutMe}</div>
                        ) : (
                            <textarea
                                placeholder="Tell Blocklance about yourself..."
                                rows={5}
                                className="text-gray-700 w-full p-3"
                                value={updatedDetails.aboutMe}
                                onChange={(e) =>
                                    setUpdatedDetails({
                                        ...updatedDetails,
                                        aboutMe: e.target.value,
                                    })
                                }
                            />
                        )}
                       
                    </div>
                </div>
            </div>
        </div>
    );
}
