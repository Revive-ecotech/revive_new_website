import React from "react";

const DeleteAccountPage = () => {
    return (
        <main className="min-h-screen bg-[#F2F7F2] px-6 py-16">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-md">

                {/* Page Heading */}
                <h1 className="text-3xl md:text-4xl font-bold text-[#253612]">
                    Delete Your Revive Eco Account
                </h1>

                <p className="mt-4 text-gray-600">
                    If you would like to permanently delete your Revive Eco
                    account and associated personal data, submit a deletion
                    request using the appropriate form below.
                </p>

                {/* How to Request */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-[#253612]">
                        How to Request Deletion
                    </h2>

                    <ol className="mt-4 list-decimal pl-6 text-gray-600 space-y-2">
                        <li>
                            Select the appropriate User or Rider account deletion form.
                        </li>
                        <li>
                            Enter the email address or phone number associated with
                            your Revive Eco account.
                        </li>
                        <li>
                            Submit the deletion request.
                        </li>
                        <li>
                            We will verify the request and process the deletion.
                        </li>
                    </ol>
                </div>

                {/* User Account */}
                <div className="mt-10 border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-2xl font-semibold text-[#253612]">
                        Delete User Account
                    </h2>

                    <p className="mt-3 text-gray-600">
                        If you use the Revive Eco User App, submit your account
                        deletion request using the button below.
                    </p>

                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLScw3OUSuNBvKG72xW6kSSKPng_o4vcKkDQuV2X_40MZBypmlw/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        Request User Account Deletion
                    </a>
                </div>

                {/* Rider Account */}
                <div className="mt-6 border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-2xl font-semibold text-[#253612]">
                        Delete Rider Account
                    </h2>

                    <p className="mt-3 text-gray-600">
                        If you use the Revive Eco Rider App, submit your rider
                        account deletion request using the button below.
                    </p>

                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSe6GcpO6632yMj6cOftlDQmN645LskJwEQnD4B1s2NLohjVAQ/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        Request Rider Account Deletion
                    </a>
                </div>

                {/* What Will Be Deleted */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-[#253612]">
                        What Will Be Deleted
                    </h2>

                    <ul className="mt-4 list-disc pl-6 text-gray-600 space-y-2">
                        <li>Account and profile information</li>
                        <li>Contact information</li>
                        <li>Saved addresses</li>
                        <li>Authentication and account data</li>
                        <li>Other eligible personal data associated with the account</li>
                    </ul>
                </div>

                {/* Retained Data */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-[#253612]">
                        Data That May Be Retained
                    </h2>

                    <p className="mt-4 text-gray-600">
                        Certain information may be retained where required for
                        legal compliance, accounting, security, fraud prevention,
                        dispute resolution, or other legitimate purposes.
                    </p>
                </div>

                {/* Processing */}
                <div className="mt-10">
                    <h2 className="text-2xl font-semibold text-[#253612]">
                        What Happens After You Submit a Request?
                    </h2>

                    <p className="mt-4 text-gray-600">
                        After receiving your request, we will verify that the
                        request is associated with the account owner. Once the
                        request has been verified, we will process the deletion
                        of eligible account data.
                    </p>
                </div>

            </div>
        </main>
    );
};

export default DeleteAccountPage;